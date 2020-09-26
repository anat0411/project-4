import { Component, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-first-page',
  templateUrl: './first-page.component.html',
  styleUrls: ['./first-page.component.css'],
})
export class FirstPageComponent implements OnInit {
  showFirstPage: boolean = true;

  constructor() {}

  ngOnInit(): void {}

  imageSrcCart = '/images/shopping-cart-1275480_1920.jpg';
  imageSrcVegetables = '/images/tomatoes-1561565_1920.jpg';
  imageSrcFruits = '/images/apple-1873078_1920.jpg';
}
