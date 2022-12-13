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
import { of, BehaviorSubject, combineLatest } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root',
})
export class ClipService {
  public clipsCollection: AngularFirestoreCollection<IClip>;

  constructor(
    private _db: AngularFirestore,
    private _auth: AngularFireAuth,
    private _storage: AngularFireStorage
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
}
