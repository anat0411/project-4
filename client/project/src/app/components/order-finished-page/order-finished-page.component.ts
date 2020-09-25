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

    let items = null;
    let itemsPrices = [];
    let totatPurchasePrice = null;

    itemsPrices = this.orderSummary.cart.items.map((item) => {
      return item.item_price;
    });

    for (let i = 0; i < this.orderSummary.cart.items.length; i++) {
      console.log(this.orderSummary.cart.items[i]);
      items = this.orderSummary.cart.items[i];
      console.log(items);
    }

    totatPurchasePrice = itemsPrices.reduce((a, b) => a + b, 0);

    console.log(totatPurchasePrice);

    let dataForDownload = [
      { Title: 'Thank You For Your Purchase!' },
      { questions: 'for any questions, please write us' },
      { email: 'shop@example.com' },
      { totalPriceText: 'Total Price: ' },
      { totalPrice: totatPurchasePrice },
      { itemsText: 'Items: ' },
      { name: items.name },
      { itemPriceText: 'Item Price: ' },
      { price: items.item_price },
      { itemUnits: 'Item Units: ' },
      { units: items.product_units },
      { deliveryInfoText: 'Delivery Information: ' },
      { city: this.orderSummary.deliveryData.city },
      { street: this.orderSummary.deliveryData.street },
      { delivery_date: this.orderSummary.deliveryData.delivery_date },
    ];

    console.log(dataForDownload);

    var options = {
      fieldSeparator: '   ',
      quoteStrings: ' ',
      decimalseparator: ' ',
      showTitle: true,
      useBom: true,
    };
    new Angular2Txt(dataForDownload, 'My Report', options);
  }
}
