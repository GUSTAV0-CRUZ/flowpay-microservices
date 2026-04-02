import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { PaymentService } from './payment.service';
import { PaymentDto } from './dtos/payment.dto';
import { Channel, Message } from 'amqplib';
import { PaymentWebhookDto } from './dtos/payment-webhook.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @MessagePattern('payment')
  async payment(@Payload() paymentDto: PaymentDto, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef() as Channel;
    const originalMsg = ctx.getMessage() as Message;

    await this.paymentService.payment(paymentDto);
    channel.ack(originalMsg);
  }

  @EventPattern('refund')
  async refund(@Payload() refund: string, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef() as Channel;
    const originalMsg = ctx.getMessage() as Message;

    await this.paymentService.refund(refund);
    channel.ack(originalMsg);
  }

  @EventPattern('payment-succeeded')
  async paymentSucceeded(
    @Payload() paymentWebhookDto: PaymentWebhookDto,
    @Ctx() ctx: RmqContext,
  ) {
    const channel = ctx.getChannelRef() as Channel;
    const originalMsg = ctx.getMessage() as Message;

    await this.paymentService.paymentSucceeded(paymentWebhookDto);
    channel.ack(originalMsg);
  }

  @EventPattern('payment-failed')
  async paymentFailed(
    @Payload() paymentWebhookDto: PaymentWebhookDto,
    @Ctx() ctx: RmqContext,
  ) {
    const channel = ctx.getChannelRef() as Channel;
    const originalMsg = ctx.getMessage() as Message;

    await this.paymentService.paymentFailed(paymentWebhookDto);
    channel.ack(originalMsg);
  }
}
