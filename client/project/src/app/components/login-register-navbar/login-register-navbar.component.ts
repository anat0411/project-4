import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-register-navbar',
  templateUrl: './login-register-navbar.component.html',
  styleUrls: ['./login-register-navbar.component.css'],
})
export class LoginRegisterNavbarComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  onLogin() {
    console.log('login');
  }
}
