import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Injectable } from '@angular/core';
import {
  AsyncValidator,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class EmailTaken implements AsyncValidator {
  constructor(private _auth: AngularFireAuth) {}

  validate = (control: AbstractControl): Promise<ValidationErrors | null> => {
    return this._auth
      .fetchSignInMethodsForEmail(control.value)
      .then((response) => (response.length ? { emailTaken: true } : null));
  };
}
