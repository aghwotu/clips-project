import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
  QuerySnapshot,
} from '@angular/fire/compat/firestore';
import IClip from '../models/clip.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { switchMap, map } from 'rxjs/operators';
import { of, BehaviorSubject, combineLatest, firstValueFrom } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ClipService implements Resolve<IClip | null> {
  public clipsCollection: AngularFirestoreCollection<IClip>;
  pageClips: IClip[] = [];
  pendingRequests: boolean = false;

  constructor(
    private _db: AngularFirestore,
    private _auth: AngularFireAuth,
    private _storage: AngularFireStorage,
    private _router: Router
  ) {
    this.clipsCollection = _db.collection('clips');
  }

  createClip(data: IClip): Promise<DocumentReference<IClip>> {
    return this.clipsCollection.add(data);
  }

  getUserClips(sort$: BehaviorSubject<string>) {
    return combineLatest([this._auth.user, sort$]).pipe(
      switchMap((values) => {
        const [user, sort] = values;

        if (!user) {
          return of([]);
        }

        const query = this.clipsCollection.ref
          .where('uid', '==', user.uid)
          .orderBy('timestamp', sort === '1' ? 'desc' : 'asc');
        return query.get();
      }),
      map((snapshot) => (snapshot as QuerySnapshot<IClip>).docs)
    );
  }

  updateClip(id: string, clipTitle: string) {
    return this.clipsCollection.doc(id).update({
      clipTitle,
    });
  }

  async deleteClip(clip: IClip) {
    const clipReference = this._storage.ref(`clips/${clip.fileName}`);
    const screenshotReference = this._storage.ref(
      `screenshots/${clip.screenshotFileName}`
    );

    await clipReference.delete();
    await screenshotReference.delete();

    await this.clipsCollection.doc(clip.docID).delete();
  }

  async getClips() {
    if (this.pendingRequests) {
      return;
    }

    this.pendingRequests = true;

    // query to fetch data from firebase
    let query = this.clipsCollection.ref.orderBy('timestamp', 'desc').limit(6);

    const { length } = this.pageClips;

    if (length) {
      const lastDocumentID = this.pageClips[length - 1].docID;
      // .toPromise() is deprecated
      // const lastDocument = await this.clipsCollection.doc(lastDocumentID).get().toPromise();
      const lastDocument = await firstValueFrom(
        this.clipsCollection.doc(lastDocumentID).get()
      );

      // tell firebase where next we should start fetching from
      query = query.startAfter(lastDocument);
    }
    const snapshot = await query.get();
    snapshot.forEach((document) => {
      this.pageClips.push({
        docID: document.id,
        ...document.data(),
      });
    });

    this.pendingRequests = false;
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.clipsCollection
      .doc(route.params['id'])
      .get()
      .pipe(
        map((snapshot) => {
          const data = snapshot.data();

          if (!data) {
            this._router.navigate(['/']);
            return null;
          }

          return data;
        })
      );
  }
}
