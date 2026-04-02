import { Injectable, Logger } from '@nestjs/common';
import { StatusPaymentEnum } from './enums/status-payment.enum';
import { PaymentDto } from './dtos/payment.dto';
import { HistoryPaymentRepository } from './repository/history-payment.repository';
import { RpcException } from '@nestjs/microservices';
import { StripeService } from '../stripe/stripe.service';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly historyPaymentRepository: HistoryPaymentRepository,
    private readonly stripeService: StripeService,
  ) {}

  async payment(paymentDto: PaymentDto) {
    this.logger.log(
      `Method: ${this.payment.name}, args: ${JSON.stringify(paymentDto)}`,
    );
    const { amount, idProduct } = paymentDto;
    const currency = 'brl';
    const amountInCents = amount * 100;

    try {
      const { id: idPaymentIntent, client_secret: clientSecret } =
        await this.stripeService.createPaymentIntent(amountInCents, currency);

      await this.addHistory(idPaymentIntent, idProduct, amount, currency);
      return { idPaymentIntent, clientSecret };
    } catch (error) {
      this.logger.error(error);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new RpcException(error.message);
    }
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

  async findOneHistory(idPaymentIntent: string) {
    try {
      const historyPayment =
        await this.historyPaymentRepository.findOneByidPaymentIntent(
          idPaymentIntent,
        );

      if (!historyPayment) throw new RpcException('historyPayment not found');

      return historyPayment;
    } catch (error) {
      this.logger.error(error);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new RpcException(error.message);
    }
  }

  async updateStatusHistoryPayment(
    idPaymentIntent: string,
    statusPayment: StatusPaymentEnum,
  ) {
    try {
      const historyPayment = await this.historyPaymentRepository.updateStatus(
        idPaymentIntent,
        statusPayment,
      );

      if (!historyPayment) throw new RpcException('historyPayment not found');

      return historyPayment;
    } catch (error) {
      this.logger.error(error);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new RpcException(error.message);
    }
  }

  async handleWebHook(req: Request) {}
}
