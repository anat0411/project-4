import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-register-navbar',
  templateUrl: './login-register-navbar.component.html',
  styleUrls: ['./login-register-navbar.component.css'],
})
export class LoginRegisterNavbarComponent implements OnInit {
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onLogin() {}

  onLogout() {
    window.sessionStorage.clear();
    this.router.navigateByUrl('/login');
    this.auth.logout().subscribe((data) => {
      console.log(data);
    });
  }

  onAdminLogout() {
    this.auth.adminLogout().subscribe((data) => {
      window.sessionStorage.clear();
      this.router.navigateByUrl('/admin/login');
    });
  }

  isCustomerLoggedIn() {
    return this.auth.isCustomerAuthenticated();
  }

  isAdminLoggedIn() {
    return this.auth.isAdminAuthenticated();
  }
}
