import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../services/server.service';
import { Product } from '../../models/product';
import { Router } from '@angular/router';
import { Customer } from 'src/app/models/customer';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css'],
})
export class ProductsListComponent implements OnInit {
  constructor(
    private server: ServerService,
    private router: Router,
    private auth: AuthService
  ) {}

  productsToShow: Product[] = [];
  customer: Customer = null;

  ngOnInit(): void {
    console.log(this.router.url);
    this.loadInitDataFromServer();
    this.server.getSearchData().subscribe((data) => {
      this.updateProductToShowWithSearchData(data);
    });
    this.server.getSearchString().subscribe((searchString) => {
      if (searchString.length < 1) {
        this.loadInitDataFromServer();
      }
    });
    this.auth.getCustomer().subscribe((customer) => {
      this.customer = customer;
      console.log(customer);
    });
  }

  updateProductToShowWithSearchData(data) {
    this.productsToShow = data;
  }

  loadInitDataFromServer() {
    switch (this.router.url) {
      case '/products-list':
        this.server.getAllProducts().subscribe((data: Product[]) => {
          this.productsToShow = data;
          console.log(this.productsToShow);
        });
        break;
      case '/products-list/vegtables&fruits':
        this.server
          .getVegatablesFruitsProducts()
          .subscribe((data: Product[]) => {
            this.productsToShow = data;
          });
        break;
      case '/products-list/milk&eggs':
        this.server.getMilkEggesProducts().subscribe((data: Product[]) => {
          this.productsToShow = data;
        });
        break;
      case '/products-list/meat&fish':
        this.server.getMeatFishProducts().subscribe((data: Product[]) => {
          this.productsToShow = data;
        });
        break;
      default:
        break;
    }
  }

  onAddToCart(product) {
    console.log('add new product to cart: ', product);
    this.server.setNewCartProduct(product);
  }

  onNumOfUnits(event) {
    console.log(event);
  }
}
