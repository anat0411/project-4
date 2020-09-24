import { Item } from './item';

export interface Cart {
  id: Number;
  items: [Item];
  totalPrice: Number;
}
