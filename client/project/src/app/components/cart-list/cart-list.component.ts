import { Component, OnInit, OnDestroy } from '@angular/core';
import { ServerService } from 'src/app/services/server.service';
import { Cart } from 'src/app/models/cart';
import { AuthService } from 'src/app/services/auth.service';
import { Customer } from 'src/app/models/customer';
import { Subscription } from 'rxjs';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.css'],
})
export class CartListComponent implements OnInit, OnDestroy {
  constructor(private server: ServerService, private auth: AuthService) {}

  customer: Customer;
  cart: any;
  getNewProductSubscription: Subscription;
  faTimesCircle = faTimesCircle;
  totalPrice = null;

  ngOnInit(): void {
    console.log('Init');

    if (!this.getNewProductSubscription) {
      this.getNewProductSubscription = this.server
        .getNewCartProduct()
        .subscribe((newProduct) => {
          console.log(newProduct);
          if (newProduct) {
            // console.log(this.cart.id);
            this.server
              .addProductToCart(
                newProduct.product_id,
                this.cart && this.cart.id ? this.cart.id : null,
                newProduct.units_to_buy
              )
              .subscribe((result) => {
                this.loadCart(this.customer.customer_id_number);
                console.log(result);
              });
            this.server.setNewCartProduct(null);
          }
        });
    }
    this.auth.getCustomer().subscribe((customer) => {
      this.customer = customer;
      console.log(this.customer);
      this.loadCart(this.customer.customer_id_number);
    });
  }

  calculateTotalPrice(cart) {
    let totalPrice = 0;
    cart.items.forEach((item) => {
      totalPrice = totalPrice + item.item_price;
    });
    console.log('TOTAL PRICE  ---', totalPrice);
    this.totalPrice = totalPrice;
  }

  loadCart(id) {
    this.server.getCart(id).subscribe((data) => {
      this.cart = data;
      console.log(this.cart);
      this.calculateTotalPrice(this.cart);
    });
  }

  onRemove(item) {
    this.server.removeItemFromCart(item).subscribe((data) => {
      console.log(data);
      this.cart.items = data;
      this.calculateTotalPrice(this.cart);
    });
  }

  onRemoveCart(cartId) {
    this.server.removeAllCartItems(cartId).subscribe((data) => {
      console.log(data);
      this.cart = null;
      this.totalPrice = 0;
    });
  }

  ngOnDestroy() {
    this.getNewProductSubscription.unsubscribe();
  }
}
