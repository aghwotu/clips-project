import { Component } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  constructor(private _auth: AuthService) {}

  showAlert: boolean = false;
  alertMessage: string = 'Please wait! Your account is being created.';
  alertColor: string = 'blue';
  formInSubmission: boolean = false;

  name = new UntypedFormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);
  email = new UntypedFormControl('', [Validators.required, Validators.email]);
  age = new UntypedFormControl('', [
    Validators.required,
    Validators.min(18),
    Validators.max(120),
  ]);
  password = new UntypedFormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm),
  ]);
  confirmPassword = new UntypedFormControl('Android7', [Validators.required]);
  phoneNumber = new UntypedFormControl('', [
    Validators.required,
    Validators.minLength(13),
    Validators.maxLength(13),
  ]);

  registerForm = new UntypedFormGroup({
    name: this.name,
    email: this.email,
    age: this.age,
    password: this.password,
    confirmPassword: this.confirmPassword,
    phoneNumber: this.phoneNumber,
  });

  async register() {
    this.showAlert = true;
    this.alertMessage = 'Please wait! Your account is being created.';
    this.alertColor = 'blue';
    this.formInSubmission = true;

    try {
      await this._auth.createUser(this.registerForm.value);
      this.formInSubmission = false;
    } catch (e) {
      console.error(e);
      this.alertMessage = 'An unexpected error occured, please try again later';
      this.alertColor = 'red';
      this.formInSubmission = false;
      return;
    }

    this.alertMessage = 'Success! Your account has been created.';
    this.alertColor = 'green';
  }
}
