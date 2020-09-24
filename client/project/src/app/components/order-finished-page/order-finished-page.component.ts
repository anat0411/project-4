import { Component, OnInit } from '@angular/core';
import { Angular2Txt } from 'angular2-txt/Angular2-txt';
import { ServerService } from 'src/app/services/server.service';

@Component({
  selector: 'app-order-finished-page',
  templateUrl: './order-finished-page.component.html',
  styleUrls: ['./order-finished-page.component.css'],
})
export class OrderFinishedPageComponent implements OnInit {
  constructor(private server: ServerService) {}
  orderSummary: any;
  ngOnInit(): void {
    this.server.getOrderSummary().subscribe((orderSummary) => {
      this.orderSummary = orderSummary;
      console.log(orderSummary);
    });

    const items = this.orderSummary.cart.items.forEach((item) => {
      console.log(item);
      //shows each product
      //////////doesnt bring items units & total price!!!
    });

    // let dataForDownload = [
    //   {Title:'thanks'},
    //   {totalPrice: }
    // ]
    ///////// add data for the recipet
    //using for each for orderSummary.cart.items, all of them in one array
    //using orderSummary.deliveryData for city, street, delivery_date for the rest of the recipet data

    var data = [
      {
        name: 'Test 1',
        age: 13,
        average: 8.2,
        approved: true,
        description: "using 'Content here, content here' ",
      },
      {
        name: 'Test 2',
        age: 11,
        average: 8.2,
        approved: true,
        description: "using 'Content here, content here' ",
      },
      {
        name: 'Test 4',
        age: 10,
        average: 8.2,
        approved: true,
        description: "using 'Content here, content here' ",
      },
    ];
    var options = {
      fieldSeparator: '   ',
      quoteStrings: ' ',
      decimalseparator: ' ',
      showTitle: true,
      useBom: true,
    };
    new Angular2Txt(data, 'My Report', options);
  }
}
