import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  invalidLogin: boolean = false;
  showErrors: boolean = false;
  errorLogin: boolean = false;

  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.minLength(2),
      Validators.maxLength(30),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(100),
      Validators.pattern('^[a-zA-Z0-9]+$'),
    ]),
  });

  constructor(
    private router: Router,
    private http: HttpClient,
    private auth: AuthService
  ) {}

  ngOnInit(): void {}

  onLogin() {
    this.router.navigateByUrl('/products-list');
  }

  onFormSubmit() {
    const email = this.loginForm.get('email').value;
    const password = this.loginForm.get('password').value;

    this.http
      .post(
        `${environment.baseUrl.server}/login`,
        { email, password },
        {
          withCredentials: true,
        }
      )
      .subscribe(
        (resp: any) => {
          if (!resp.success) {
            this.errorLogin = true;
          } else {
            this.errorLogin = false;
            const customerData = {
              ...resp,
              firstName: resp.firstname,
              lastName: resp.lastname,
            };
            this.auth.setCustomer(customerData);

            this.onLogin();
          }
        },
        (errorResp) => {
          console.log(
            'Oops, something went wrong getting the logged in status'
          );
        }
      );
  }
}
