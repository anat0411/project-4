import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Product } from '../../models/product';
import { ServerService } from 'src/app/services/server.service';

@Component({
  selector: 'app-products-edit',
  templateUrl: './products-edit.component.html',
  styleUrls: ['./products-edit.component.css'],
})
export class ProductsEditComponent implements OnInit {
  showErrors: boolean = false;
  product: Product;

  constructor(
    private router: Router,
    private http: HttpClient,
    private server: ServerService
  ) {}

  ngOnInit(): void {}

  editProductForm = new FormGroup({
    productName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50),
    ]),
    productPrice: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
    ]),
    productImage: new FormControl('', [Validators.required]),
  });

  onFormSubmit() {
    const productName = this.editProductForm.get('productName').value;
    const productPrice = this.editProductForm.get('productPrice').value;
    const productImage = this.editProductForm.get('productImage').value;

    this.http
      .post(
        `${environment.baseUrl.server}/admin/edit/product/${this.product.product_id}`,
        { productName, productPrice, productImage },
        {
          withCredentials: true,
        }
      )
      .subscribe(
        (resp: any) => {
          console.log(resp);
          const productData = {
            // name: resp.email,
            // identification_number: resp.identification_number,
            // customerIdNumber: resp.customerIdNumber,
          };
          // this.server.setProductDATA(productData);

          console.log('LOGGED IN_____________');
          console.log(productData, ' PRODUCT DATA');
        },
        (errorResp) => {
          console.log(
            'Oops, something went wrong getting the logged in status'
          );
        }
      );
  }
}
