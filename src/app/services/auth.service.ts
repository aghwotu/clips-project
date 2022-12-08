import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import IUser from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _usersCollection: AngularFirestoreCollection<IUser>;

  constructor(private _auth: AngularFireAuth, private _db: AngularFirestore) {
    this._usersCollection = this._db.collection('users');
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
}
