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
    console.log(event.target.value.length);
    const searchString = event.target.value;
    if (event.target.value.length > 0) {
      this.server
        .getSearchProducts(event.target.value)
        .subscribe((data: Product[]) => {
          console.log(data);
          this.server.setSearchData(data);
          this.server.setSearchString(searchString);
        });
    } else {
      this.server.setSearchString(searchString);
    }
  }
}
