import { Body, Controller, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { BuyProductDto } from './dtos/buy-product.dto';
import { ClientProxyService } from '../client-proxy/client-proxy.service';

@Controller('order')
export class OrderController {
  private serviceOrderClientProxy: ClientProxy;

  constructor(clientProxyService: ClientProxyService) {
    this.serviceOrderClientProxy =
      clientProxyService.getClientProxyServiceOrder();
  }

  @Post('buyProduct')
  buyProduct(@Body() buyProductDto: BuyProductDto) {
    console.log(buyProductDto);
    return this.serviceOrderClientProxy.send('buyProduct-order', buyProductDto);
  }

  // @EventPattern('reversalProduct-order')
  // async reversalProduct(
  //   @Payload() reversalProductDto: ReversalProductDto,
  //   @Ctx() ctx: RmqContext,
  // ) {
  //   const channel = ctx.getChannelRef() as Channel;
  //   const originalMsg = ctx.getMessage() as Message;

  //   try {
  //     await this.orderService.reversalProduct(reversalProductDto);
  //     channel.ack(originalMsg);
  //   } catch (error) {
  //     catchWithMessageResilience(error, channel, originalMsg);
  //   }
  // }

  // @EventPattern('addProduct-order')
  // async addProduct(
  //   @Payload() addProductDto: AddProductDto,
  //   @Ctx() ctx: RmqContext,
  // ) {
  //   const channel = ctx.getChannelRef() as Channel;
  //   const originalMsg = ctx.getMessage() as Message;

  //   try {
  //     await this.orderService.addProduct(addProductDto);
  //     channel.ack(originalMsg);
  //   } catch (error) {
  //     catchWithMessageResilience(error, channel, originalMsg);
  //   }
  // }

  // @EventPattern('removeProduct-order')
  // async removeProduct(
  //   @Payload() removeProductDto: RemoveProductDto,
  //   @Ctx() ctx: RmqContext,
  // ) {
  //   const channel = ctx.getChannelRef() as Channel;
  //   const originalMsg = ctx.getMessage() as Message;

  //   try {
  //     await this.orderService.removeProduct(removeProductDto);
  //     channel.ack(originalMsg);
  //   } catch (error) {
  //     catchWithMessageResilience(error, channel, originalMsg);
  //   }
  // }

  // @EventPattern('confirmOrder-order')
  // async confirmOrder(
  //   @Payload() confirmOrderDto: ConfirmOrderDto,
  //   @Ctx() ctx: RmqContext,
  // ) {
  //   const channel = ctx.getChannelRef() as Channel;
  //   const originalMsg = ctx.getMessage() as Message;

  //   try {
  //     await this.orderService.confirmOrder(confirmOrderDto);
  //     channel.ack(originalMsg);
  //   } catch (error) {
  //     catchWithMessageResilience(error, channel, originalMsg);
  //   }
  // }

  // @EventPattern('rollbackOrder-order')
  // async rollbackOrder(
  //   @Payload() rollbackOrderDto: RollbackOrderDto,
  //   @Ctx() ctx: RmqContext,
  // ) {
  //   const channel = ctx.getChannelRef() as Channel;
  //   const originalMsg = ctx.getMessage() as Message;

  //   try {
  //     await this.orderService.rollback(rollbackOrderDto);
  //     channel.ack(originalMsg);
  //   } catch (error) {
  //     catchWithMessageResilience(error, channel, originalMsg);
  //   }
  // }
}
