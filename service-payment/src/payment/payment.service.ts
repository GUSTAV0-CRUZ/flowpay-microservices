import { Injectable, Logger } from '@nestjs/common';
import { StatusPaymentEnum } from './enums/status-payment.enum';
import { PaymentDto } from './dtos/payment.dto';
import { HistoryPaymentRepository } from './repository/history-payment.repository';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly historyPaymentRepository: HistoryPaymentRepository,
  ) {}

  async payment(paymentDto: PaymentDto) {
    this.logger.log(
      `Method: ${this.payment.name}, args: ${JSON.stringify(paymentDto)}`,
    );
  }

  async refund(idProduct: string) {}

  async addHistory(
    paymentIntentId: string,
    idProduct: string,
    amount: number,
    currency: string,
  ) {}

  async updateStatusHistoryPayment(paymentIntentId: string, statusPayment: StatusPaymentEnum) {}

  async findOneHistory(paymentIntentId: string) {}

  async handleWebHook(req: Request) {}
}
