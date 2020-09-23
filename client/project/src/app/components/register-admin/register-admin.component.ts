import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-register-admin',
  templateUrl: './register-admin.component.html',
  styleUrls: ['./register-admin.component.css'],
})
export class RegisterAdminComponent implements OnInit {
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

    adminIdNumber: new FormControl('', [
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

  onAdminRegister() {
    console.log('login admin');
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
    const adminIdNumber = this.registerForm.get('adminIdNumber').value;
    const password = this.registerForm.get('password').value;

    const adminData = {
      firstName,
      lastName,
      email,
      adminIdNumber,
      password,
    };

    console.log(adminData);

    this.http
      .post(`${environment.baseUrl.server}/register`, adminData, {
        withCredentials: true,
      })
      .subscribe(
        (resp: any) => {
          console.log(resp);
          const adminData = { email: resp.email, id: resp.id };
          this.auth.setAdmin(adminData);

          console.log('registered_____________');
          this.onAdminRegister();
        },
        (errorResp) => {
          console.log(
            'Oops, something went wrong getting the logged in status'
          );
        }
      );
  }
}
