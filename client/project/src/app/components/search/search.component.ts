import { Component, OnInit } from '@angular/core';
import { ServerService } from 'src/app/services/server.service';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  constructor(private server: ServerService) {}

  ngOnInit(): void {}

  onSearchChange(event) {
    const searchString = event.target.value;
    this.server.setSearchString(searchString);
  }
}
