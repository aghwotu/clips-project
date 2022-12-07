import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _auth: AngularFireAuth, private _db: AngularFirestore) {}

  public async createUser(userData: any) {
    const userCredentials = await this._auth.createUserWithEmailAndPassword(
      userData.email,
      userData.password
    );
    await this._db.collection('users').add({
      name: userData.name,
      email: userData.email,
      age: userData.age,
      phoneNumber: userData.phoneNumber,
    });
  }
}
