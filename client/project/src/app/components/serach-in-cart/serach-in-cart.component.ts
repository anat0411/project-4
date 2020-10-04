import { Component, OnInit } from '@angular/core';
import { ServerService } from 'src/app/services/server.service';

@Component({
  selector: 'app-serach-in-cart',
  templateUrl: './serach-in-cart.component.html',
  styleUrls: ['./serach-in-cart.component.css'],
})
export class SerachInCartComponent implements OnInit {
  constructor(private server: ServerService) {}

  ngOnInit(): void {}

  onSearchChange(event) {
    const searchString = event.target.value;
    this.server.setCartSearchString(searchString);
  }
}
