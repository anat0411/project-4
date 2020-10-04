import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ServerService } from 'src/app/services/server.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products-add',
  templateUrl: './products-add.component.html',
  styleUrls: ['./products-add.component.css'],
})
export class ProductsAddComponent implements OnInit {
  showErrors: boolean = false;
  uploadingProduct: boolean = false;
  product: any;
  categories: any = null;
  public uploader: FileUploader = new FileUploader({
    url: `${environment.baseUrl.server}/admin/upload_product_image`,
    itemAlias: 'image',
  });

  constructor(private server: ServerService, private router: Router) {}

  ngOnInit(): void {
    this.getCategories();
    this.defineImageUploader();
  }

  getCategories() {
    this.server.getCategories().subscribe((categories: [any]) => {
      this.categories = categories;
    });
  }

  defineImageUploader() {
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = true;
    };
    this.uploader.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      this.product.product_image = JSON.parse(response).imagePath;
      this.server.addNewProduct(this.product).subscribe((response) => {
        this.uploadingProduct = false;
        this.router.navigateByUrl('/products-list-admin');
      });
    };
  }

  addProductForm = new FormGroup({
    productName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50),
    ]),
    productPrice: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
    ]),
    productCategory: new FormControl('', [Validators.required]),
    productImage: new FormControl('', [Validators.required]),
  });

  onFormSubmit() {
    if (this.addProductForm.valid) {
      this.showErrors = false;
      this.uploadingProduct = true;
      this.uploader.uploadAll();
      // image upload

      this.product = {
        name: this.addProductForm.get('productName').value,
        category_id: this.addProductForm.get('productCategory').value,
        product_price: this.addProductForm.get('productPrice').value,
      };
    } else {
      this.showErrors = true;
      return;
    }
  }
}
