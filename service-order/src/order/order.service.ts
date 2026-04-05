import { Injectable, Logger } from '@nestjs/common';
import { BuyProductDto } from './dtos/buy-product.dto';
import { ReversalProductDto } from './dtos/reversal-product.dto';
import { AddProductDto } from './dtos/add-product.dto';
import { OrderRepository } from './repository/order.respository';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { RemoveProductDto } from './dtos/remove-product.dto';
import { StatusProductEnum } from './enums/status-product.enum';
import { ClientProxyService } from '../client-proxy/client-proxy.service';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);
  private servicePaymentClientProxy: ClientProxy;
  private inventoryProductClientProxy: ClientProxy;

  constructor(
    private readonly orderRepository: OrderRepository,
    clientProxyService: ClientProxyService,
  ) {
    this.servicePaymentClientProxy =
      clientProxyService.getClientProxyServicePayment();
    this.inventoryProductClientProxy =
      clientProxyService.getClientProxyInventoryProduct();
  }

  async buyProduct(buyProductDto: BuyProductDto) {
    this.logger.log(this.buyProduct.name, buyProductDto);
    try {
      const { idProduct, price, status } = await this.findOneByIdProduct(
        buyProductDto.idProduct,
      );

      if (status !== StatusProductEnum.AVAILABLE)
        throw new RpcException('Product not AVAILABLE');

      const paymentIntent = await lastValueFrom<{
        idPaymentIntent: string;
        clientSecret: string;
      }>(
        this.servicePaymentClientProxy.send('payment', {
          idProduct,
          amount: price,
        }),
      );

      await this.changeStatus(idProduct, StatusProductEnum.RESERVED);

      this.inventoryProductClientProxy.emit('changeStatus-inventory', {
        id: idProduct,
        changeStatusDto: StatusProductEnum.RESERVED,
      });

      return paymentIntent;
    } catch (error: any) {
      this.logger.error(error);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
      throw new RpcException(error.message);
    }
  }

  async reversalProduct(reversalProductDto: ReversalProductDto) {
    this.logger.log(this.reversalProduct.name, reversalProductDto);
    try {
      const { idProduct, status } = await this.findOneByIdProduct(
        reversalProductDto.idProduct,
      );

      if (status !== StatusProductEnum.SOLDOUT)
        throw new RpcException('Product not SOLDOUT');

      this.servicePaymentClientProxy.emit('refund', idProduct);

      await this.changeStatus(idProduct, StatusProductEnum.AVAILABLE);

      this.inventoryProductClientProxy.emit('changeStatus-inventory', {
        id: idProduct,
        changeStatusDto: StatusProductEnum.AVAILABLE,
      });

      return idProduct;
    } catch (error: any) {
      this.logger.error(error);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
      throw new RpcException(error.message);
    }
  }

  async rollback() {}

  async confirmOrder() {}

  private async findOneByIdProduct(idProduct: string) {
    this.logger.log(this.findOneByIdProduct.name, idProduct);
    try {
      const product = await this.orderRepository.findOneByIdProduct(idProduct);

      if (!product) throw new RpcException('Product not found');

      return product;
    } catch (error: any) {
      this.logger.error(error);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
      throw new RpcException(error.message);
    }
  }

  async addProduct(addProductDto: AddProductDto) {
    this.logger.log(this.addProduct.name, addProductDto);
    try {
      return await this.orderRepository.addProduct(addProductDto);
    } catch (error: any) {
      this.logger.error(error);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
      throw new RpcException(error.message);
    }
  }

  async removeProduct(removeProductDto: RemoveProductDto) {
    this.logger.log(this.removeProduct.name, removeProductDto);
    try {
      const product = await this.orderRepository.removeProduct(
        removeProductDto.idProduct,
      );

      if (!product) throw new RpcException('Product not found');

      return product;
    } catch (error: any) {
      this.logger.error(error);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
      throw new RpcException(error.message);
    }
  }

  private async changeStatus(
    idProduct: string,
    statusProductEnum: StatusProductEnum,
  ) {
    this.logger.log(this.changeStatus.name, idProduct, statusProductEnum);
    try {
      const product = await this.orderRepository.changeStatus(
        idProduct,
        statusProductEnum,
      );

      if (!product) throw new RpcException('Product not found');

      return product;
    } catch (error: any) {
      this.logger.error(error);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
      throw new RpcException(error.message);
    }
  }
}
