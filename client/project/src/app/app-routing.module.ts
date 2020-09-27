import { NgModule, Injectable } from '@angular/core';
import { Routes, RouterModule, CanActivate, Router } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { LoginAdminComponent } from './components/login-admin/login-admin.component';
import { RegisterAdminComponent } from './components/register-admin/register-admin.component';
import { ProductsListAdminComponent } from './components/products-list-admin/products-list-admin.component';
import { OrderComponent } from './components/order/order.component';
import { OrderFinishedPageComponent } from './components/order-finished-page/order-finished-page.component';
import { ProductsAddComponent } from './components/products-add/products-add.component';
import { AuthService } from './services/auth.service';
import { FirstPageComponent } from './components/first-page/first-page.component';
import { AboutComponent } from './components/about/about.component';

@Injectable()
export class OnlyLoggedInCustomer implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate() {
    if (this.auth.isCustomerAuthenticated()) {
      return true;
    }
    this.router.navigateByUrl('/');
    return false;
  }
}

@Injectable()
export class OnlyLoggedInAdmin implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate() {
    console.log(this.auth.isAdminAuthenticated());
    if (this.auth.isAdminAuthenticated()) {
      return true;
    }
    this.router.navigateByUrl('/');
    return false;
  }
}

const routes: Routes = [
  { path: '', component: FirstPageComponent },
  { path: 'about', component: AboutComponent },
  { path: 'admin/login', component: LoginAdminComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin/register', component: RegisterAdminComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'products-list',
    component: ProductsListComponent,
    canActivate: [OnlyLoggedInCustomer],
  },
  {
    path: 'products-list/milk&eggs',
    component: ProductsListComponent,
    canActivate: [OnlyLoggedInCustomer],
  },
  {
    path: 'products-list/vegtables&fruits',
    component: ProductsListComponent,
    canActivate: [OnlyLoggedInCustomer],
  },
  {
    path: 'products-list/meat&fish',
    component: ProductsListComponent,
    canActivate: [OnlyLoggedInCustomer],
  },
  {
    path: 'products-list-admin',
    component: ProductsListAdminComponent,
    canActivate: [OnlyLoggedInAdmin],
  },
  {
    path: 'order',
    component: OrderComponent,
    canActivate: [OnlyLoggedInCustomer],
  },
  {
    path: 'order/finished',
    component: OrderFinishedPageComponent,
    canActivate: [OnlyLoggedInCustomer],
  },
  {
    path: 'admin/add/product',
    component: ProductsAddComponent,
    canActivate: [OnlyLoggedInAdmin],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
