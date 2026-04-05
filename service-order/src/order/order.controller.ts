import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { BuyProductDto } from './dtos/buy-product.dto';
import { ReversalProductDto } from './dtos/reversal-product.dto';
import { AddProductDto } from './dtos/add-product.dto';
import { OrderService } from './order.service';
import { Message, Channel } from 'amqplib';
import { RemoveProductDto } from './dtos/remove-product.dto';
import { ConfirmOrderDto } from './dtos/confirm-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @MessagePattern('buyProduct-order')
  async buyProduct(
    @Payload() buyProductDto: BuyProductDto,
    @Ctx() ctx: RmqContext,
  ) {
    const channel = ctx.getChannelRef() as Channel;
    const originalMsg = ctx.getMessage() as Message;

    const paymenteIntent = await this.orderService.buyProduct(buyProductDto);
    channel.ack(originalMsg);
    return paymenteIntent;
  }

  @EventPattern('reversalProduct-order')
  async reversalProduct(
    @Payload() reversalProductDto: ReversalProductDto,
    @Ctx() ctx: RmqContext,
  ) {
    const channel = ctx.getChannelRef() as Channel;
    const originalMsg = ctx.getMessage() as Message;

    await this.orderService.reversalProduct(reversalProductDto);
    channel.ack(originalMsg);
  }

  @EventPattern('addProduct-order')
  async addProduct(
    @Payload() addProductDto: AddProductDto,
    @Ctx() ctx: RmqContext,
  ) {
    const channel = ctx.getChannelRef() as Channel;
    const originalMsg = ctx.getMessage() as Message;

    await this.orderService.addProduct(addProductDto);
    channel.ack(originalMsg);
  }

  @EventPattern('removeProduct-order')
  async removeProduct(
    @Payload() removeProductDto: RemoveProductDto,
    @Ctx() ctx: RmqContext,
  ) {
    const channel = ctx.getChannelRef() as Channel;
    const originalMsg = ctx.getMessage() as Message;

    await this.orderService.removeProduct(removeProductDto);
    channel.ack(originalMsg);
  }

  @EventPattern('confirmOrder-order')
  async confirmOrder(
    @Payload() confirmOrderDto: ConfirmOrderDto,
    @Ctx() ctx: RmqContext,
  ) {
    const channel = ctx.getChannelRef() as Channel;
    const originalMsg = ctx.getMessage() as Message;

    await this.orderService.confirmOrder(confirmOrderDto);
    channel.ack(originalMsg);
  }
}
