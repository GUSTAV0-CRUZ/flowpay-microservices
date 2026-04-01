import { StatusPaymentEnum } from '../enums/status-payment.enum';

export class HistoryPayment {
  id?: string;
  paymentIntentId: string;
  idProduct: string;
  amount: number;
  currency: string;
  status: StatusPaymentEnum;
  createdAt?: Date;
  updatedAt?: Date;
}
