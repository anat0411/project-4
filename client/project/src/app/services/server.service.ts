import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product';
import { Item } from '../models/item';

@Injectable({
  providedIn: 'root',
})
export class ServerService {
  private newCartProduct: BehaviorSubject<Product>;
  private orderSummary: BehaviorSubject<any>;

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
        units_to_buy: null,
      },
    ]);
    //initial value
    this.searchString = new BehaviorSubject<String>('');

    this.newCartProduct = new BehaviorSubject<Product>(null);
    this.orderSummary = new BehaviorSubject<any>(null);
  }

  getNewCartProduct(): Observable<Product> {
    return this.newCartProduct.asObservable();
  }
  setNewCartProduct(newCartProduct): void {
    this.newCartProduct.next(newCartProduct);
  }

  getOrderSummary(): Observable<any> {
    return this.orderSummary.asObservable();
  }
  setOrderSummary(orderSummary): void {
    this.orderSummary.next(orderSummary);
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

  getAllProductsAdmin() {
    return this.http.get(`${environment.baseUrl.server}/admin/products`, {
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

  addProductToCart(productId, cartId, units) {
    const body = {
      product_id: productId,
      cart_id: cartId,
      units: units || 1,
    };
    console.log(body);
    return this.http.post(`${environment.baseUrl.server}/add/item/cart`, body, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  getDates() {
    return this.http.get(`${environment.baseUrl.server}/get/delivery/dates`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // addOrder(productId, cartId, units) {
  //   const body = {
  //     product_id: productId,
  //     cart_id: cartId,
  //     units: units || 1,
  //   };
  //   console.log(body);
  //   return this.http.post(`${environment.baseUrl.server}/add/item/cart`, body, {
  //     withCredentials: true,
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   });
  // }

  getCart(id) {
    return this.http.get(`${environment.baseUrl.server}/cart/${id}`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  removeItemFromCart(item) {
    const item_id = item.item_id;
    const body = {
      cart_id: item.cart_id,
    };
    return this.http.delete(
      `${environment.baseUrl.server}/delete/cart/item/${item_id}`,
      {
        withCredentials: true,
        params: new HttpParams({ fromString: `cart_id=${item.cart_id}` }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  removeAllCartItems(cartId) {
    return this.http.delete(
      `${environment.baseUrl.server}/delete/cart/${cartId}`,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
