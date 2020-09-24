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

  onLogin() {
    console.log('login');
  }

  onLogout() {
    this.auth.logout().subscribe((data) => {
      console.log(data);
      window.sessionStorage.clear();
      this.router.navigateByUrl('/login');
    });
  }

  onAdminLogout() {
    this.auth.adminLogout().subscribe((data) => {
      console.log(data);
      window.sessionStorage.clear();
      this.router.navigateByUrl('/admin/login');
    });
  }
}
