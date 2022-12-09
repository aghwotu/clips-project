import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import IUser from '../models/user.model';
import { map, delay, filter, switchMap } from 'rxjs/operators';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _usersCollection: AngularFirestoreCollection<IUser>;
  public isAuthenticated$: Observable<boolean>;
  public isAuthenticatedWithDelay$: Observable<boolean>;
  private _redirect: boolean = false;

  constructor(
    private _auth: AngularFireAuth,
    private _db: AngularFirestore,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this._usersCollection = this._db.collection('users');
    this.isAuthenticated$ = this._auth.user.pipe(map((user) => Boolean(user)));
    // allow a 1second delay after authentication so the modal doesn't close abruptly
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(delay(1000));

    this._router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        map((e) => this._route.firstChild),
        switchMap((route) => route?.data ?? of({}))
      )
      .subscribe((data) => {
        this._redirect = data['authOnly'] ?? false;
      });
  }

  public async createUser(userData: IUser) {
    if (!userData.password) {
      throw new Error('Password not provided.');
    }
    // register user with the authentication service
    const userCredentials = await this._auth.createUserWithEmailAndPassword(
      userData.email,
      userData.password
    );

    if (!userCredentials.user) {
      throw new Error("User can't be found.");
    }
    // store the user in the database
    await this._usersCollection.doc(userCredentials.user?.uid).set({
      name: userData.name,
      email: userData.email,
      age: userData.age,
      phoneNumber: userData.phoneNumber,
    });

    await userCredentials.user.updateProfile({
      displayName: userData.name,
    });
  }

  public async logout($event?: Event) {
    if ($event) {
      $event.preventDefault();
    }
    await this._auth.signOut();

    if (this._redirect) {
      await this._router.navigateByUrl('/');
    }
  }
}
