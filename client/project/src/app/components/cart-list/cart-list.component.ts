import { Component, OnInit, OnDestroy } from '@angular/core';
import { ServerService } from 'src/app/services/server.service';
import { Cart } from 'src/app/models/cart';
import { AuthService } from 'src/app/services/auth.service';
import { Customer } from 'src/app/models/customer';
import { Subscription } from 'rxjs';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { faRecycle } from '@fortawesome/free-solid-svg-icons';
import { Product } from 'src/app/models/product';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.css'],
})
export class CartListComponent implements OnInit, OnDestroy {
  constructor(
    private server: ServerService,
    private auth: AuthService,
    private router: Router
  ) {}

  customer: Customer;
  cartItems: any[] = [];
  cart: any;
  getNewProductSubscription: Subscription;
  faTimesCircle = faTimesCircle;
  faTrash = faRecycle;
  totalPrice = null;
  searchString: String = null;
  showEditItems: boolean = true;
  environment = environment;

  ngOnInit(): void {
    if (this.router.url.includes('order')) {
      this.showEditItems = false;
    }

    if (!this.getNewProductSubscription) {
      this.getNewProductSubscription = this.server
        .getNewCartProduct()
        .subscribe((newProduct) => {
          if (newProduct) {
            this.server
              .addProductToCart(
                newProduct.product_id,
                this.cart && this.cart.id ? this.cart.id : null,
                newProduct.units_to_buy
              )
              .subscribe((result) => {
                this.loadCart(this.customer.customer_id_number);
              });
            this.server.setNewCartProduct(null);
          }
        });
    }
    this.customer = this.auth.getCustomerDataFromSession();
    if (this.customer) {
      this.loadCart(this.customer.customer_id_number);
    }

    this.server.getCartSearchString().subscribe((search) => {
      if (this.cart) {
        this.searchString = search;

        this.cartItems = this.cart.items.filter((product) => {
          return product.name
            .toLowerCase()
            .includes(this.searchString.toLowerCase());
        });
        console.log(this.cartItems);
      }
    });
  }

  calculateTotalPrice(cart) {
    if (!cart || !cart.items || cart.items.lenght === 0) {
      return 0;
    }
    let totalPrice = 0;
    cart.items.forEach((item) => {
      totalPrice = totalPrice + item.item_price;
    });
    this.totalPrice = totalPrice;
  }

  loadCart(id) {
    this.server.getCart(id).subscribe((data: any) => {
      this.cart = data;
      this.cartItems = data.items;
      this.calculateTotalPrice(this.cart);
    });
  }

  onRemove(item) {
    this.server.removeItemFromCart(item).subscribe((data) => {
      this.cart.items = data;
      this.calculateTotalPrice(this.cart);
    });
  }

  onRemoveCart(cartId) {
    this.server.removeAllCartItems(cartId).subscribe((data) => {
      this.cart = null;
      this.totalPrice = 0;
    });
  }

  ngOnDestroy() {
    this.getNewProductSubscription.unsubscribe();
  }
}
