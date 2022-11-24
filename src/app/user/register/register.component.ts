import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.email]),
    age: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
    phoneNumber: new FormControl(''),
  });
}
