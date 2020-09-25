import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Customer } from '../models/customer';
import { Admin } from '../models/admin';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isCustomerLoggedIn: BehaviorSubject<Boolean>;
  private customer: BehaviorSubject<Customer>;
  private admin: BehaviorSubject<Admin>;

  constructor(private http: HttpClient) {
    this.isCustomerLoggedIn = new BehaviorSubject<Boolean>(false);
    this.customer = new BehaviorSubject<Customer>(null);
    this.admin = new BehaviorSubject<Admin>(null);
  }

  isCustomerAuthenticated(): Boolean {
    const isCustomerLoggedIn = window.sessionStorage.getItem(
      'isCustomerLoggedIn'
    );
    if (!isCustomerLoggedIn || isCustomerLoggedIn !== 'true') return false;
    return true;
  }

  isAdminAuthenticated(): Boolean {
    const isAdminLoggedIn = window.sessionStorage.getItem('isAdminLoggedIn');
    if (!isAdminLoggedIn || isAdminLoggedIn !== 'true') return false;
    return true;
  }

  getIsCustomerLoggedIn(): Observable<Boolean> {
    return this.isCustomerLoggedIn.asObservable();
  }

  setIsCustomerLoggedIn(status): void {
    this.isCustomerLoggedIn.next(status);
  }

  getCustomer(): Observable<Customer> {
    return this.customer.asObservable();
  }

  setCustomer(data): void {
    console.log(data);
    window.sessionStorage.clear();
    window.sessionStorage.setItem(
      'identification_number',
      data.identification_number
    );
    window.sessionStorage.setItem(
      'customer_id_number',
      data.customer_id_number
    );
    window.sessionStorage.setItem('email', data.email);
    window.sessionStorage.setItem('city', data.city);
    window.sessionStorage.setItem('street', data.street);
    window.sessionStorage.setItem('firstName', data.firstname);
    window.sessionStorage.setItem('lastName', data.lastname);
    window.sessionStorage.setItem(
      'isCustomerLoggedIn',
      (
        data.email &&
        data.email !== 'null' &&
        data.email !== 'undefined'
      ).toString()
    );
    this.customer.next(data);
  }

  setAdmin(data): void {
    window.sessionStorage.clear();
    window.sessionStorage.setItem('admin id', data.id);
    window.sessionStorage.setItem('admin email', data.email);
    window.sessionStorage.setItem(
      'isAdminLoggedIn',
      (
        data.email &&
        data.email !== 'null' &&
        data.email !== 'undefined'
      ).toString()
    );
    this.admin.next(data);
  }

  getCustomerDataFromSession() {
    const identification_number = window.sessionStorage.getItem(
      'identification_number'
    );
    const customer_id_number = window.sessionStorage.getItem(
      'customer_id_number'
    );
    const city = window.sessionStorage.getItem('city');
    const street = window.sessionStorage.getItem('street');
    const email = window.sessionStorage.getItem('email');
    const firstName = window.sessionStorage.getItem('firstName');
    const lastName = window.sessionStorage.getItem('lastName');
    const isCustomerLoggedIn = window.sessionStorage.getItem(
      'isCustomerLoggedIn'
    );
    this.setCustomer({
      identification_number,
      email,
      customer_id_number,
      city,
      street,
      firstName: firstName,
      lastName: lastName,
      isCustomerLoggedIn: isCustomerLoggedIn,
    });
  }

  getAdminDataFromSession() {
    const id = window.sessionStorage.getItem('admin id');
    const email = window.sessionStorage.getItem('admin email');
    const isAdminLoggedIn = window.sessionStorage.getItem('isAdminLoggedIn');
    this.setAdmin({ id, email, isAdminLoggedIn: isAdminLoggedIn });
  }

  logout() {
    return this.http.get(`${environment.baseUrl.server}/logout`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  adminLogout() {
    return this.http.get(`${environment.baseUrl.server}/admin/logout`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
