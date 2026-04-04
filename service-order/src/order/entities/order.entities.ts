import { StatusProductEnum } from '../enums/status-product.enum';

export class Order {
  id?: string;
  idProduct: string;
  status: StatusProductEnum;
  createdAt?: Date;
  updatedAt?: Date;
}
