import { Injectable, Logger } from '@nestjs/common';
import { StatusPaymentEnum } from './enums/status-payment.enum';
import { PaymentDto } from './dtos/payment.dto';
import { HistoryPaymentRepository } from './repository/history-payment.repository';
import {
  ClientProxy,
  RmqRecordBuilder,
  RpcException,
} from '@nestjs/microservices';
import { StripeService } from '../stripe/stripe.service';
import { PaymentWebhookDto } from './dtos/payment-webhook.dto';
import { loggerError } from '../utils/logger-error';
import { ClientProxyService } from '../client-proxy/client-proxy.service';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private serviceOrderClientProxy: ClientProxy;
  private servicePaymentClientProxy: ClientProxy;

  constructor(
    private readonly historyPaymentRepository: HistoryPaymentRepository,
    private readonly stripeService: StripeService,
    clientProxyService: ClientProxyService,
  ) {
    this.serviceOrderClientProxy =
      clientProxyService.getClientProxyServiceOrder();
    this.servicePaymentClientProxy =
      clientProxyService.getClientProxyServicePayment();
  }

  async payment(paymentDto: PaymentDto) {
    this.logger.log(`Method: ${this.payment.name}`, { paymentDto });
    const { amount, idProduct } = paymentDto;
    const currency = 'brl';
    const amountInCents = amount * 100;

    try {
      const { id: idPaymentIntent, client_secret: clientSecret } =
        await this.stripeService.createPaymentIntent(amountInCents, currency);

      await this.addHistory(idPaymentIntent, idProduct, amount, currency);

      const record = new RmqRecordBuilder(idPaymentIntent)
        .setOptions({
          headers: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            'x-delay': 600000 as any,
          },
        })
        .build();

      this.servicePaymentClientProxy.emit('payment-expire', record);

      return { idPaymentIntent, clientSecret };
    } catch (error: any) {
      loggerError(error, this.logger, this.payment.name);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new RpcException(error.message);
    }
  }

  async refund(idProduct: string) {
    this.logger.log(this.refund.name, { idProduct });
    try {
      const historyPayment = await this.findByIdProductStatusPaid(idProduct);
      const { idPaymentIntent } = historyPayment;

      await this.stripeService.refundPayment(idPaymentIntent);
      await this.updateStatusHistoryPayment(
        idPaymentIntent,
        StatusPaymentEnum.REFUNDED,
      );

      return idPaymentIntent;
    } catch (error: any) {
      loggerError(error, this.logger, this.refund.name);
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
    } catch (error: any) {
      loggerError(error, this.logger, this.addHistory.name);
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
    } catch (error: any) {
      loggerError(error, this.logger, this.findByIdProductStatusPaid.name);
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
    } catch (error: any) {
      loggerError(error, this.logger, this.updateStatusHistoryPayment.name);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new RpcException(error.message);
    }
  }

  async paymentSucceeded(paymentWebhookDto: PaymentWebhookDto) {
    this.logger.log(this.paymentSucceeded.name, { paymentWebhookDto });

    try {
      const historyPayment = await this.updateStatusHistoryPayment(
        paymentWebhookDto.paymentIntentId,
        StatusPaymentEnum.PAID,
      );

      this.serviceOrderClientProxy.emit('confirmOrder-order', {
        idProduct: historyPayment.idProduct,
      });

      return historyPayment;
    } catch (error: any) {
      loggerError(error, this.logger, this.paymentSucceeded.name);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new RpcException(error.message);
    }
  }

  async paymentFailed(paymentWebhookDto: PaymentWebhookDto) {
    this.logger.log(this.paymentFailed.name, { paymentWebhookDto });
    try {
      const historyPayment = await this.updateStatusHistoryPayment(
        paymentWebhookDto.paymentIntentId,
        StatusPaymentEnum.FAILED,
      );

      await this.stripeService.cancelPayment(paymentWebhookDto.paymentIntentId);

      return historyPayment;
    } catch (error: any) {
      loggerError(error, this.logger, this.paymentFailed.name);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new RpcException(error.message);
    }
  }

  async paymentCanceled(paymentWebhookDto: PaymentWebhookDto) {
    this.logger.log(this.paymentCanceled.name, { paymentWebhookDto });
    try {
      const historyPayment = await this.updateStatusHistoryPayment(
        paymentWebhookDto.paymentIntentId,
        StatusPaymentEnum.CANCELED,
      );

      this.serviceOrderClientProxy.emit('rollbackOrder-order', {
        idProduct: historyPayment.idProduct,
      });

      return historyPayment;
    } catch (error: any) {
      loggerError(error, this.logger, this.paymentCanceled.name);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new RpcException(error.message);
    }
  }

  async expirePayment(paymentIntentId: string) {
    this.logger.log(this.expirePayment.name, { paymentIntentId });
    try {
      const history =
        await this.historyPaymentRepository.findOneByIdPaymentIntent(
          paymentIntentId,
        );

      if (!history) throw new RpcException('Paiment not found');

      if (history.status !== StatusPaymentEnum.PENDING)
        throw new RpcException('Paiment not PENDING');

      await this.stripeService.cancelPayment(paymentIntentId);

      return history;
    } catch (error: any) {
      loggerError(error, this.logger, this.paymentFailed.name);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new RpcException(error.message);
    }
  }
}
