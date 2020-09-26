import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../services/server.service';
import { Product } from '../../models/product';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-products-list-admin',
  templateUrl: './products-list-admin.component.html',
  styleUrls: ['./products-list-admin.component.css'],
})
export class ProductsListAdminComponent implements OnInit {
  constructor(private server: ServerService) {}

  faEdit = faEdit;
  faPlus = faPlus;
  environment = environment;
  editingProduct = false;
  productToEdit = null;

  productsToShow: Product[] = [];

  ngOnInit(): void {
    this.server.getAllProductsAdmin().subscribe((data: Product[]) => {
      this.productsToShow = data;
      console.log(this.productsToShow);
    });
  }

  onEdit(product) {
    this.editingProduct = true;
    this.productToEdit = product
  }
}
