import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product';
import { Item } from '../models/item';

@Injectable({
  providedIn: 'root',
})
export class ServerService {
  private newCartProduct: BehaviorSubject<Product>;

  private searchData: BehaviorSubject<[Product]>;
  private searchString: BehaviorSubject<String>;

  constructor(private http: HttpClient) {
    this.searchData = new BehaviorSubject<[Product]>([
      {
        product_id: null,
        name: null,
        category_id: null,
        category_name: null,
        product_price: null,
        product_image: null,
      },
    ]);
    //initial value
    this.searchString = new BehaviorSubject<String>('');

    this.newCartProduct = new BehaviorSubject<Product>(null);
  }

  getNewCartProduct(): Observable<Product> {
    return this.newCartProduct.asObservable();
  }
  setNewCartProduct(newCartProduct): void {
    this.newCartProduct.next(newCartProduct);
  }

  getSearchData(): Observable<[Product]> {
    return this.searchData.asObservable();
  }
  setSearchData(newSearchData): void {
    this.searchData.next(newSearchData);
  }

  getSearchString(): Observable<String> {
    return this.searchString.asObservable();
  }
  setSearchString(newSearchString): void {
    this.searchString.next(newSearchString);
  }

  getSearchProducts(input) {
    return this.http.get(
      `${environment.baseUrl.server}/products/search/${input}`,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  getAllProducts() {
    return this.http.get(`${environment.baseUrl.server}/products`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  getMilkEggesProducts() {
    console.log(`${environment.baseUrl.server}/Milk,Eggs`);
    return this.http.get(`${environment.baseUrl.server}/Milk,Eggs`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  getMeatFishProducts() {
    console.log(`${environment.baseUrl.server}/Meat,Fish`);
    return this.http.get(`${environment.baseUrl.server}/Meat,Fish`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  getVegatablesFruitsProducts() {
    console.log(`${environment.baseUrl.server}/Vegatables,Fruits`);
    return this.http.get(`${environment.baseUrl.server}/Vegatables,Fruits`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  addProductToCart(productId, cartId) {
    const body = {
      product_id: productId,
      cart_id: cartId,
    };
    console.log(body);
    return this.http.post(`${environment.baseUrl.server}/add/item/cart`, body, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  getCart(customerid) {
    return this.http.get(`${environment.baseUrl.server}/cart/${customerid}`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
