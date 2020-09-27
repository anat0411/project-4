import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../services/auth.service';
import { ServerService } from 'src/app/services/server.service';
import { Customer } from 'src/app/models/customer';
import { Cart } from 'src/app/models/cart';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit {
  showErrors: boolean = false;
  dates: any = [];
  customer: Customer = null;
  cart: Cart = null;
  dateError: boolean = false;

  dateMin = new Date().toISOString().split('T')[0];

  shippingDetails = new FormGroup({
    city: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(30),
      Validators.pattern('^[a-zA-Z]+$'),
    ]),
    street: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
      Validators.pattern('^[a-zA-Z]+$'),
    ]),
    deliveryDate: new FormControl('', [Validators.required]),
  });
  constructor(
    private auth: AuthService,
    private router: Router,
    private http: HttpClient,
    private server: ServerService
  ) {}

  ngOnInit(): void {
    console.log(this.dateMin);
    this.customer = this.auth.getCustomerDataFromSession();
    console.log(this.customer);
    this.server
      .getCart(this.customer.customer_id_number)
      .subscribe((cart: Cart) => {
        this.cart = cart;
        console.log(this.cart);
      });
    this.server.getDates().subscribe((dates) => {
      console.log('dates: ', dates);
      this.dates = dates;
    });
  }

  setCity() {
    console.log('set city');
    console.log(this.shippingDetails.get('city').value);
    console.log(this.shippingDetails.get('deliveryDate').value);
    this.shippingDetails.setValue({
      city: this.customer.city,
      street: this.customer.street,
      deliveryDate: new Date().toISOString().slice(0, 10),
    });
  }

  onOrder() {
    console.log('order-----------------------');
    this.router.navigateByUrl('order/finished');
  }

  onOrderSubmit() {
    this.showErrors = true;

    if (this.shippingDetails.invalid) {
      this.showErrors = true;
      return;
    }

    this.showErrors = false;

    const city = this.shippingDetails.get('city').value;
    const street = this.shippingDetails.get('street').value;
    const deliveryDate = this.shippingDetails.get('deliveryDate').value;

    const deliveryData = {
      city,
      street,
      delivery_date: deliveryDate,
      customer_id_number: this.customer.customer_id_number,
    };

    console.log(deliveryData);
    console.log(this.cart);

    const orderSummary = { deliveryData, cart: this.cart };

    console.log(orderSummary);

    this.server.setOrderSummary(orderSummary);

    this.http
      .post(
        `${environment.baseUrl.server}/order/cart/${this.cart.id}`,
        deliveryData,
        {
          withCredentials: true,
        }
      )
      .subscribe(
        (resp: any) => {
          console.log(resp);
          const deliveryData = { email: resp.email, id: resp.id };

          console.log('orderd------------------------');
          this.onOrder();
        },
        (errorResp) => {
          console.log(
            'Oops, something went wrong getting the logged in status'
          );
        }
      );
  }

  checkDates(event) {
    console.log(event.target.value);
    let count = 0;
    this.dates.forEach((date) => {
      if (event.target.value === date.delivery_date.slice(0, 10)) {
        count = count + 1;
      }
    });

    if (count > 2) {
      this.dateError = true;
    } else {
      this.dateError = false;
    }
  }
}
