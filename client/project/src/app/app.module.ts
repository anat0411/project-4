import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import {
  AppRoutingModule,
  OnlyLoggedInCustomer,
  OnlyLoggedInAdmin,
} from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginRegisterNavbarComponent } from './components/login-register-navbar/login-register-navbar.component';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { CategoryNavbarComponent } from './components/category-navbar/category-navbar.component';
import { CartListComponent } from './components/cart-list/cart-list.component';
import { LoginAdminComponent } from './components/login-admin/login-admin.component';
import { RegisterAdminComponent } from './components/register-admin/register-admin.component';
import { SearchComponent } from './components/search/search.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProductsListAdminComponent } from './components/products-list-admin/products-list-admin.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OrderComponent } from './components/order/order.component';
import { OrderFinishedPageComponent } from './components/order-finished-page/order-finished-page.component';
import { SerachInCartComponent } from './components/serach-in-cart/serach-in-cart.component';
import { ProductsEditComponent } from './components/products-edit/products-edit.component';
import { ProductsAddComponent } from './components/products-add/products-add.component';
import { FileUploadModule } from 'ng2-file-upload';
import { FirstPageComponent } from './components/first-page/first-page.component';
import { AboutComponent } from './components/about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    LoginRegisterNavbarComponent,
    ProductsListComponent,
    CategoryNavbarComponent,
    CartListComponent,
    LoginAdminComponent,
    RegisterAdminComponent,
    SearchComponent,
    ProductsListAdminComponent,
    OrderComponent,
    OrderFinishedPageComponent,
    SerachInCartComponent,
    ProductsEditComponent,
    ProductsAddComponent,
    FirstPageComponent,
    AboutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule,
    FileUploadModule,
  ],
  providers: [OnlyLoggedInCustomer, OnlyLoggedInAdmin],
  bootstrap: [AppComponent],
})
export class AppModule {}
