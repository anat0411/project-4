import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit {
  showErrors: boolean = false;

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
    private http: HttpClient
  ) {}

  ngOnInit(): void {}

  onOrder() {
    console.log('order-----------------------');
    this.router.navigateByUrl('order/finished');
  }

  onOrderSubmit() {
    this.showErrors = true;

    if (this.shippingDetails.invalid) {
      return;
    }

    const city = this.shippingDetails.get('city').value;
    const street = this.shippingDetails.get('street').value;
    const deliveryDate = this.shippingDetails.get('deliveryDate').value;

    const deliveryData = {
      city,
      street,
      delivery_date: deliveryDate,
    };

    console.log(deliveryData);

    this.http
      .post(`${environment.baseUrl.server}/api/order/cart`, deliveryData, {
        withCredentials: true,
      })
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
}
