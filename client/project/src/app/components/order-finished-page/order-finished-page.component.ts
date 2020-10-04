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
    });

    let itemsPrices = [];
    let totatPurchasePrice = null;
    let items = this.orderSummary.cart.items;

    itemsPrices = this.orderSummary.cart.items.map((item) => {
      return item.item_price;
    });

    totatPurchasePrice = itemsPrices.reduce((a, b) => a + b, 0);

    let dataForDownload = [
      { itemTitle: '' },
      { itemsTitlePrice: '' },
      { itemsTitleUnits: '' },
      { itemsName: '' },
      { itemsPrice: '' },
      { itemsUnits: '' },
      {
        Title: 'Thank You For Your Purchase! ',
      },
      { questions: 'for any questions, please write us. ' },
      {
        email: 'freshmarket@fm.com',
      },

      { totalPriceText: 'Total Price: ', totalPrice: totatPurchasePrice },

      { deliveryInfoText: 'Delivery Information: ' },
      { cityTitle: 'City: ', city: this.orderSummary.deliveryData.city },
      {
        streetTitle: 'Street: ',
        street: this.orderSummary.deliveryData.street,
      },
      {
        deliveryTitle: 'Delivery Date: ',
        delivery_date: this.orderSummary.deliveryData.delivery_date,
      },
      { itemsTitle: '' },
    ];

    items.forEach((item, index) => {
      let num = index + 1;

      dataForDownload.push({
        itemsTitle: 'Items',
      });

      dataForDownload.push({
        itemTitle: 'Item Number ' + num + ': ',
        itemsName: item.name,
      });

      dataForDownload.push({
        itemsTitlePrice: 'Price: ',
      });

      dataForDownload.push({
        itemsPrice: item.item_price,
      });
      dataForDownload.push({
        itemsTitleUnits: 'Units: ',
      });
      dataForDownload.push({
        itemsUnits: item.product_units,
      });
    });

    var options = {
      fieldSeparator: '   ',
      quoteStrings: ' ',
      decimalseparator: ' ',
      showTitle: true,
      useBom: true,
    };
    new Angular2Txt(dataForDownload, 'My recepit', options);
  }
}
