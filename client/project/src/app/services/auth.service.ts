import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Customer } from '../models/customer';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isCustomerLoggedIn: BehaviorSubject<Boolean>;
  private customer: BehaviorSubject<Customer>;
  constructor() {
    this.isCustomerLoggedIn = new BehaviorSubject<Boolean>(false);
    this.customer = new BehaviorSubject<Customer>(null);
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
    this.customer.next(data);
  }
}
