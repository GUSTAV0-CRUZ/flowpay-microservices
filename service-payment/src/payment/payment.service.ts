import { Injectable, Logger } from '@nestjs/common';
import { StatusPaymentEnum } from './enums/status-payment.enum';
import { PaymentDto } from './dtos/payment.dto';
import { HistoryPaymentRepository } from './repository/history-payment.repository';
import { RpcException } from '@nestjs/microservices';

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
    const currency = 'brl';

    const idPaymentIntent = 'idPaymentIntent123';

    // await this.addHistory(
    //   idPaymentIntent,
    //   paymentDto.idProduct,
    //   paymentDto.amount,
    //   currency,
    // );
  }

  async refund(idProduct: string) {}

  async addHistory(
    idPaymentIntent: string,
    idProduct: string,
    amount: number,
    currency: string,
  ) {
    try {
      return await this.historyPaymentRepository.create({
        idPaymentIntent,
        idProduct,
        amount,
        currency,
      });
    } catch (error) {
      this.logger.error(error);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === 11000)
        throw new RpcException('key: "idPaymentIntent" is duplicate');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new RpcException(error.message);
    }
  }

  async updateStatusHistoryPayment(idPaymentIntent: string, statusPayment: StatusPaymentEnum) {}

  async findOneHistory(idPaymentIntent: string) {}

  async handleWebHook(req: Request) {}
}
