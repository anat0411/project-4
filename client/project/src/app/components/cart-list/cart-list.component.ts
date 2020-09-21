import { Component, OnInit } from '@angular/core';
import { ServerService } from 'src/app/services/server.service';
import { Cart } from 'src/app/models/cart';
import { AuthService } from 'src/app/services/auth.service';
import { Customer } from 'src/app/models/customer';

@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.css'],
})
export class CartListComponent implements OnInit {
  constructor(private server: ServerService, private auth: AuthService) {}

  customer: Customer;
  cart: any;

  ngOnInit(): void {
    this.server.getNewCartProduct().subscribe((newProduct) => {
      console.log(newProduct);
      if (newProduct && this.cart) {
        console.log(this.cart.id);
        this.server
          .addProductToCart(newProduct.product_id, this.cart.id)
          .subscribe((result) => {
            this.loadCart(this.customer.id);
            console.log(result);
          });
      }
    });
    this.auth.getCustomer().subscribe((customer) => {
      this.customer = customer;
      console.log(this.customer);
      this.loadCart(this.customer.id);
    });
  }

  loadCart(customerId) {
    this.server.getCart(customerId).subscribe((data) => {
      this.cart = data;
      console.log(this.cart);
    });
  }
}
