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

  loginForm = new FormGroup({
    email: new FormControl(),
    password: new FormControl(),
  });

  constructor(
    private router: Router,
    private http: HttpClient,
    private auth: AuthService
  ) {}

  ngOnInit(): void {}

  onLogin() {
    console.log('login');
    this.router.navigateByUrl('/products-list');
  }

  onFormSubmit() {
    const email = this.loginForm.get('email').value;
    const password = this.loginForm.get('password').value;
    console.log('email: ', email);
    console.log('password: ', password);

    this.http
      .post(
        `${environment.baseUrl.server}/login`,
        { email, password },
        {
          withCredentials: false,
        }
      )
      .subscribe(
        (resp: any) => {
          console.log(resp);
          const customerData = { email: resp.email, id: resp.id };
          this.auth.setCustomer(customerData);
          console.log('LOGGED IN_____________');
          this.onLogin();
        },
        (errorResp) => {
          console.log(
            'Oops, something went wrong getting the logged in status'
          );
        }
      );
  }
}
