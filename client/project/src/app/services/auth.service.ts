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
    console.log(window.sessionStorage.getItem('email'));
    const email = window.sessionStorage.getItem('email');
    if (!email || email === 'null') return false;
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
    window.sessionStorage.setItem(
      'identification_number',
      data.identification_number
    );
    window.sessionStorage.setItem('customerIdNumber', data.customerIdNumber);
    window.sessionStorage.setItem('email', data.email);
    this.customer.next(data);
  }

  setAdmin(data): void {
    window.sessionStorage.setItem('admin id', data.id);
    window.sessionStorage.setItem('admin email', data.email);
    this.admin.next(data);
  }

  getCustomerDataFromSession() {
    const identification_number = window.sessionStorage.getItem(
      'identification_number'
    );
    const customerIdNumber = window.sessionStorage.getItem('customerIdNumber');
    const email = window.sessionStorage.getItem('email');
    this.setCustomer({ identification_number, email, customerIdNumber });
  }

  getAdminDataFromSession() {
    const id = window.sessionStorage.getItem('admin id');
    const email = window.sessionStorage.getItem('admin email');
    this.setAdmin({ id, email });
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
