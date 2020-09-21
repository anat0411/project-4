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
        product_id: 1,
        name: '1',
        category_id: 1,
        category_name: '1',
        product_price: 1,
        product_image: '1',
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
      `${environment.baseUrl.server}/products/search/${input}`
    );
  }

  getAllProducts() {
    return this.http.get(`${environment.baseUrl.server}/products`);
  }

  getMilkEggesProducts() {
    console.log(`${environment.baseUrl.server}/Milk,Eggs`);
    return this.http.get(`${environment.baseUrl.server}/Milk,Eggs`);
  }

  getMeatFishProducts() {
    console.log(`${environment.baseUrl.server}/Meat,Fish`);
    return this.http.get(`${environment.baseUrl.server}/Meat,Fish`);
  }
  getVegatablesFruitsProducts() {
    console.log(`${environment.baseUrl.server}/Vegatables,Fruits`);
    return this.http.get(`${environment.baseUrl.server}/Vegatables,Fruits`);
  }

  addProductToCart(productId, cartId) {
    const body = {
      product_id: productId,
      cart_id: cartId,
    };
    console.log(body);
    return this.http.post(`${environment.baseUrl.server}/add/item/cart`, body, {
      withCredentials: false,
    });
  }

  getCart(customerid) {
    return this.http.get(`${environment.baseUrl.server}/cart/${customerid}`);
  }
}
