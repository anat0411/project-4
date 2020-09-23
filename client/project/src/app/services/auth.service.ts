import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Customer } from '../models/customer';
import { Admin } from '../models/admin';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isCustomerLoggedIn: BehaviorSubject<Boolean>;
  private customer: BehaviorSubject<Customer>;
  private admin: BehaviorSubject<Admin>;

  constructor() {
    this.isCustomerLoggedIn = new BehaviorSubject<Boolean>(false);
    this.customer = new BehaviorSubject<Customer>(null);
    this.admin = new BehaviorSubject<Admin>(null);
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
    window.sessionStorage.setItem('id', data.id);
    window.sessionStorage.setItem('email', data.email);
    this.customer.next(data);
  }

  setAdmin(data): void {
    window.sessionStorage.setItem('id', data.id);
    window.sessionStorage.setItem('email', data.email);
    this.admin.next(data);
  }

  getCustomerDataFromSession() {
    const id = window.sessionStorage.getItem('id');
    const email = window.sessionStorage.getItem('email');
    this.setCustomer({ id, email });
  }

  getAdminDataFromSession() {
    const id = window.sessionStorage.getItem('id');
    const email = window.sessionStorage.getItem('email');
    this.setAdmin({ id, email });
  }
}
