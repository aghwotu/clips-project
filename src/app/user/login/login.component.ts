import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  credentials = {
    email: '',
    password: '',
  };
  showAlert: boolean = false;
  alertMessage: string = 'Please wait! We are logging you in.';
  alertColor: string = 'blue';
  formInSubmission: boolean = false;

  constructor(private _auth: AngularFireAuth) {}

  ngOnInit(): void {}

  async login() {
    this.showAlert = true;
    this.alertMessage = 'Please wait! We are logging you in.';
    this.alertColor = 'blue';
    this.formInSubmission = true;

    const { email, password } = this.credentials;
    try {
      await this._auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      this.formInSubmission = false;
      this.alertMessage =
        'An unexpected error occured. Please try again later.';
      this.alertColor = 'red';
      console.error(error);

      throw new Error('An error occured');
      return;
    }

    this.alertMessage = 'Success! You are now logged in.';
    this.alertColor = 'green';
  }
}
