import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { LoginAdminComponent } from './components/login-admin/login-admin.component';
import { RegisterAdminComponent } from './components/register-admin/register-admin.component';
import { ProductsListAdminComponent } from './components/products-list-admin/products-list-admin.component';
import { OrderComponent } from './components/order/order.component';
import { OrderFinishedPageComponent } from './components/order-finished-page/order-finished-page.component';
import { ProductsAddComponent } from './components/products-add/products-add.component';

const routes: Routes = [
  { path: 'admin/login', component: LoginAdminComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin/register', component: RegisterAdminComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'products-list', component: ProductsListComponent },
  { path: 'products-list/milk&eggs', component: ProductsListComponent },
  {
    path: 'products-list/vegtables&fruits',
    component: ProductsListComponent,
  },
  { path: 'products-list/meat&fish', component: ProductsListComponent },
  { path: 'products-list-admin', component: ProductsListAdminComponent },
  { path: 'order', component: OrderComponent },
  { path: 'order/finished', component: OrderFinishedPageComponent },
  { path: 'admin/add/product', component: ProductsAddComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
