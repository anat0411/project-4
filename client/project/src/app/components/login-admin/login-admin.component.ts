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
  selector: 'app-login-admin',
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.css'],
})
export class LoginAdminComponent implements OnInit {
  invalidLogin: boolean = false;
  showErrors: boolean = false;

  loginAdminForm = new FormGroup({
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

  onAdminLogin() {
    console.log('admin login');
    this.router.navigateByUrl('/products-list-admin');
  }

  onAdminFormSubmit() {
    const email = this.loginAdminForm.get('email').value;
    const password = this.loginAdminForm.get('password').value;
    console.log('email: ', email);
    console.log('password: ', password);

    this.http
      .post(
        `${environment.baseUrl.server}/admin/login`,
        { email, password },
        {
          withCredentials: true,
        }
      )
      .subscribe(
        (resp: any) => {
          console.log(resp);
          const adminData = { email: resp.email, id: resp.id };
          this.auth.setAdmin(adminData);

          console.log('ADMIN LOGGED IN_____________');
          this.onAdminLogin();
        },
        (errorResp) => {
          console.log(
            'Oops, something went wrong getting the logged in status'
          );
        }
      );
  }
}
