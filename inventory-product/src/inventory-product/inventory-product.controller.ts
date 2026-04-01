import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CreateProductDto } from './dtos/create-product.dto';
import { InventoryProductService } from './inventory-product.service';
import { ChangeStatusInterface } from './interfaces/change-status.interface';
import { Channel, Message } from 'amqplib';
import { catchWithMessageResilience } from 'src/utils/catch-with-message-resilience';

@Controller('inventory-product')
export class InventoryProductController {
  constructor(
    private readonly inventoryProductService: InventoryProductService,
  ) {}

  @MessagePattern('findAll-inventory')
  async findAll(@Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef() as Channel;
    const originalMsg = ctx.getMessage() as Message;

    try {
      const response = await this.inventoryProductService.findAll();
      channel.ack(originalMsg);
      return response;
    } catch (error) {
      catchWithMessageResilience(error, channel, originalMsg);
    }
  }

  @MessagePattern('findOne-inventory')
  async findOne(@Payload() id: string, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef() as Channel;
    const originalMsg = ctx.getMessage() as Message;

    try {
      const response = await this.inventoryProductService.findOne(id);
      channel.ack(originalMsg);
      return response;
    } catch (error) {
      catchWithMessageResilience(error, channel, originalMsg);
    }
  }

  @MessagePattern('findPerStatus-inventory')
  async findPerStatus(@Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef() as Channel;
    const originalMsg = ctx.getMessage() as Message;

    try {
      const response = await this.inventoryProductService.findPerStatus();
      channel.ack(originalMsg);
      return response;
    } catch (error) {
      catchWithMessageResilience(error, channel, originalMsg);
    }
  }

  @EventPattern('createProduct-inventory')
  async createProduct(
    @Ctx() ctx: RmqContext,
    @Payload() createProductDto: CreateProductDto,
  ) {
    const channel = ctx.getChannelRef() as Channel;
    const originalMsg = ctx.getMessage() as Message;

    try {
      await this.inventoryProductService.createProduct(createProductDto);
      channel.ack(originalMsg);
    } catch (error) {
      catchWithMessageResilience(error, channel, originalMsg);
    }
  }

  @EventPattern('deleteProduct-inventory')
  async deleteProduct(@Payload() id: string, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef() as Channel;
    const originalMsg = ctx.getMessage() as Message;

    try {
      await this.inventoryProductService.deleteProduct(id);
      channel.ack(originalMsg);
    } catch (error) {
      catchWithMessageResilience(error, channel, originalMsg);
    }
  }

  @EventPattern('changeStatus-inventory')
  async changeStatus(
    @Ctx() ctx: RmqContext,
    @Payload() changeStatusInterface: ChangeStatusInterface,
  ) {
    const channel = ctx.getChannelRef() as Channel;
    const originalMsg = ctx.getMessage() as Message;

    const { id, changeStatusDto } = changeStatusInterface;

    try {
      await this.inventoryProductService.changeStatus(id, changeStatusDto);
      channel.ack(originalMsg);
    } catch (error) {
      catchWithMessageResilience(error, channel, originalMsg);
    }
  }
}
