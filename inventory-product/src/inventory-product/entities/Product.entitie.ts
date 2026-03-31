import { StatusProductEnum } from '../enums/status-product.enum';

export class Product {
  _id?: string;
  name: string;
  price: number;
  status: StatusProductEnum;
  code: string;
  createdtAt?: Date;
  updatedAt?: Date;
}
