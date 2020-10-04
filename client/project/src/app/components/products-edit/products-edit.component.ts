import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Product } from '../../models/product';
import { ServerService } from 'src/app/services/server.service';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-products-edit',
  templateUrl: './products-edit.component.html',
  styleUrls: ['./products-edit.component.css'],
})
export class ProductsEditComponent implements OnInit {
  @Input() product;
  @Output() productChange = new EventEmitter<any>();
  @Input() editingProduct;
  @Output() editingProductChange = new EventEmitter<boolean>();

  showErrors: boolean = false;
  categories: any = null;
  loadingData: boolean = true;
  environment = environment;
  uploadingProduct: boolean = false;

  public uploader: FileUploader = new FileUploader({
    url: `${environment.baseUrl.server}/admin/upload_product_image`,
    itemAlias: 'image',
  });

  constructor(
    private router: Router,
    private http: HttpClient,
    private server: ServerService
  ) {}

  ngOnInit(): void {
    this.getCategories();
    this.defineImageUploader();
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
      this.updateProduct();
    };
  }

  updateProduct() {
    this.server
      .updateProduct(this.product, this.product.product_id)
      .subscribe((response) => {
        this.uploadingProduct = false;
        this.editingProductChange.emit(false);
        this.productChange.emit(this.product);
      });
  }

  onCancel() {
    this.editingProductChange.emit(false);
  }

  getCategories() {
    this.server.getCategories().subscribe((categories: [any]) => {
      this.categories = categories;
      let category = null;
      categories.forEach((c) => {
        if (c.category_id.toString() === this.product.category_id.toString()) {
          category = c;
        }
      });
      this.editProductForm.setValue({
        productName: this.product.name,
        productPrice: this.product.product_price,
        productImage: '',
        productCategory: category.category_id,
      });
      this.loadingData = false;
    });
  }

  getCategoryNameById(id) {
    let category_name = null;
    this.categories.forEach((c) => {
      if (c.category_id.toString() === id.toString()) {
        category_name = c.category_name;
      }
    });
    return category_name;
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
    productImage: new FormControl(''),
    productCategory: new FormControl('', [Validators.required]),
  });

  onFormSubmit() {
    if (this.editProductForm.valid) {
      this.showErrors = false;
      this.uploadingProduct = true;

      this.product.name = this.editProductForm.get('productName').value;
      this.product.product_price = this.editProductForm.get(
        'productPrice'
      ).value;
      this.product.category_id = this.editProductForm.get(
        'productCategory'
      ).value;
      this.product.category_name = this.getCategoryNameById(
        this.product.category_id
      );

      const productImage = this.editProductForm.get('productImage').value;

      if (!productImage) {
        this.updateProduct();
      } else {
        this.uploader.uploadAll();
      }
    } else {
      this.showErrors = true;
    }
  }
}
