import { Injectable, Logger } from '@nestjs/common';
import { StatusPaymentEnum } from './enums/status-payment.enum';
import { PaymentDto } from './dtos/payment.dto';
import { HistoryPaymentRepository } from './repository/history-payment.repository';
import { RpcException } from '@nestjs/microservices';
import { StripeService } from '../stripe/stripe.service';
import { PaymentWebhookDto } from './dtos/payment-webhook.dto';

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
      console.log(clientSecret);
      return { idPaymentIntent, clientSecret };
    } catch (error) {
      this.logger.error(error);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new RpcException(error.message);
    }
  }

  async refund(idProduct: string) {
    this.logger.log(this.refund.name, idProduct);
    try {
      const historyPayment = await this.findByIdProductStatusPaid(idProduct);
      const { idPaymentIntent } = historyPayment;

      await this.stripeService.refundPayment(idPaymentIntent);
      await this.updateStatusHistoryPayment(
        idPaymentIntent,
        StatusPaymentEnum.REFUNDED,
      );
    } catch (error) {
      this.logger.error(error);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new RpcException(error.message);
    }
  }

  private async addHistory(
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

  private async findByIdProductStatusPaid(IdProduct: string) {
    try {
      const historyPayment =
        await this.historyPaymentRepository.findByIdProductStatusPaid(
          IdProduct,
        );

      if (!historyPayment) throw new RpcException('historyPayment not found');

      return historyPayment;
    } catch (error) {
      this.logger.error(error);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new RpcException(error.message);
    }
  }

  private async updateStatusHistoryPayment(
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

  async paymentSucceeded(paymentWebhookDto: PaymentWebhookDto) {
    this.logger.log(this.paymentSucceeded.name, paymentWebhookDto);

    try {
      const historyPayment = await this.updateStatusHistoryPayment(
        paymentWebhookDto.paymentIntentId,
        StatusPaymentEnum.PAID,
      );
      return historyPayment;
    } catch (error) {
      this.logger.error(error);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new RpcException(error.message);
    }
  }

  async paymentFailed(paymentWebhookDto: PaymentWebhookDto) {
    this.logger.log(this.paymentFailed.name, paymentWebhookDto);
    try {
      const historyPayment = await this.updateStatusHistoryPayment(
        paymentWebhookDto.paymentIntentId,
        StatusPaymentEnum.FAILED,
      );

      return historyPayment;
    } catch (error) {
      this.logger.error(error);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new RpcException(error.message);
    }
  }
}
