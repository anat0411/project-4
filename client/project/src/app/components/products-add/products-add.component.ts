import { Component, OnInit } from '@angular/core';
import { FileUploader, FileSelectDirective } from 'ng2-file-upload';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { ServerService } from 'src/app/services/server.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-products-add',
  templateUrl: './products-add.component.html',
  styleUrls: ['./products-add.component.css'],
})
export class ProductsAddComponent implements OnInit {
  showErrors: boolean = false;
  categories: any = null;
  public uploader: FileUploader = new FileUploader({
    url: `${environment.baseUrl.server}/admin/upload_product_image`,
    itemAlias: 'photo',
  });

  constructor(private server: ServerService) {}

  ngOnInit(): void {
    this.server.getCategories().subscribe((categories: [any]) => {
      console.log(categories);

      this.categories = categories;
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };
    this.uploader.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      console.log('ImageUpload:uploaded:', item, status, response);
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
    console.log(this.addProductForm.get('productCategory').value);

    this.uploader.uploadAll();

    if (this.addProductForm.valid) {
    } else {
      this.showErrors = true;
      return;
    }
  }
}
