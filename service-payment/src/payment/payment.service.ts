import { Injectable } from '@nestjs/common';
import { StatusPaymentEnum } from './enums/status-payment.enum';
import { PaymentDto } from './dtos/payment.dto';

@Injectable()
export class PaymentService {
  async payment(paymentDto: PaymentDto) {}

  async refund(idProduct: string) {}

  async addHistory(
    paymentIntentId: string,
    idProduct: string,
    amount: number,
    currency: string,
  ) {}

  async updateHistory(paymentIntentId: string, statusPayment: StatusPaymentEnum) {}

  async findOneHistory(paymentIntentId: string) {}

  async handleWebHook(req: Request) {}
}
