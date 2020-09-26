import { Component, Input, OnInit } from '@angular/core';
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
  @Input() product;

  showErrors: boolean = false;
  categories: any = null;
  loadingData: boolean = true;

  constructor(
    private router: Router,
    private http: HttpClient,
    private server: ServerService
  ) {}

  ngOnInit(): void {
    console.log(this.product);

    this.server.getCategories().subscribe((categories: [any]) => {
      console.log(categories);

      this.categories = categories;
      let category = null;
      categories.forEach((c) => {
        if (c.id === this.product.product_category) {
          category = c;
        }
      });
      console.log(category);
      this.editProductForm.setValue({
        productName: this.product.name,
        productPrice: this.product.product_price,
        productImage: this.product.product_image,
        productCategory: category.category_id,
      });
      this.loadingData = false;
    });
  }

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
    productCategory: new FormControl('', [Validators.required]),
  });

  onFormSubmit() {
    const productName = this.editProductForm.get('productName').value;
    const productPrice = this.editProductForm.get('productPrice').value;
    const productImage = this.editProductForm.get('productImage').value;
    const productCategory = this.editProductForm.get('productCategory').value;

    const data = {
      name: productName,
      product_price: productPrice,
      product_image: productImage,
      product_category: productCategory,
    };

    this.http
      .post(
        `${environment.baseUrl.server}/admin/edit/product/${this.product.product_id}`,
        { productName, productPrice, productImage, productCategory },
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
            // customer_id_number: resp.customer_id_number,
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
