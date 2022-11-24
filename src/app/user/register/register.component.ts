import { Component } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  showAlert: boolean = false;
  alertMessage: string = 'Please wait! Your account is being created.';
  alertColor: string = 'blue';

  name = new UntypedFormControl('test', [
    Validators.required,
    Validators.minLength(3),
  ]);
  email = new UntypedFormControl('t@m.com', [
    Validators.required,
    Validators.email,
  ]);
  age = new UntypedFormControl('56', [
    Validators.required,
    Validators.min(18),
    Validators.max(120),
  ]);
  password = new UntypedFormControl('Android7', [
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

  register() {
    this.showAlert = true;
    this.alertMessage = 'Please wait! Your account is being created.';
    this.alertColor = 'blue';
  }
}
