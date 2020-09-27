import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  showErrors: boolean = false;

  registerForm = new FormGroup({
    firstName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(30),
      Validators.pattern('^[a-zA-Z]+$'),
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(30),
      Validators.pattern('^[a-zA-Z]+$'),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.minLength(2),
      Validators.maxLength(30),
    ]),
    city: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(30),
      Validators.pattern('^[a-zA-Z]+$'),
    ]),
    street: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
      Validators.pattern('^[a-zA-Z]+$'),
    ]),
    identification_number: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(10),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(100),
      Validators.pattern('^[a-zA-Z0-9]+$'),
    ]),
  });
  constructor(
    private auth: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {}

  onRegister() {
    console.log('login');
    this.router.navigateByUrl('/products-list');
  }

  onRegisterSubmit() {
    this.showErrors = true;
    console.log('form valide: ', !this.registerForm.invalid);
    console.log(this.registerForm.get('firstName').invalid);

    if (this.registerForm.invalid) {
      return;
    }

    const firstName = this.registerForm.get('firstName').value;
    const lastName = this.registerForm.get('lastName').value;
    const email = this.registerForm.get('email').value;
    const city = this.registerForm.get('city').value;
    const street = this.registerForm.get('street').value;
    const identification_number = this.registerForm.get('identification_number')
      .value;
    const password = this.registerForm.get('password').value;

    const customerData = {
      firstName,
      lastName,
      email,
      city,
      street,
      identification_number,
      password,
    };

    console.log(customerData);

    this.http
      .post(`${environment.baseUrl.server}/register`, customerData, {
        withCredentials: true,
      })
      .subscribe(
        (resp: any) => {
          console.log(resp);
          // const customerData = { email: resp.email, id: resp.id };
          this.auth.setCustomer(customerData);

          console.log('registered_____________');
          this.onRegister();
          this.router.navigateByUrl('/products-list');
        },
        (errorResp) => {
          console.log(
            'Oops, something went wrong getting the logged in status'
          );
        }
      );
  }
}
