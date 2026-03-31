import { statusProduct } from '../enums/status-product';

export class Product {
  _id?: string;
  name: string;
  price: number;
  status: statusProduct;
  code: string;
  createdtAt?: Date;
  updatedAt?: Date;
}
