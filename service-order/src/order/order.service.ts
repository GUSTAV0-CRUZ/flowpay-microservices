import { Injectable, Logger } from '@nestjs/common';
import { BuyProductDto } from './dtos/buy-product.dto';
import { ReversalProductDto } from './dtos/reversal-product.dto';
import { AddProductDto } from './dtos/add-product.dto';
import { OrderRepository } from './repository/order.respository';
import { RpcException } from '@nestjs/microservices';
import { RemoveProductDto } from './dtos/remove-product.dto';
import { StatusProductEnum } from './enums/status-product.enum';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(private readonly orderRepository: OrderRepository) {}

  async buyProduct(buyProductDto: BuyProductDto) {}

  async reversalProduct(reversalProductDto: ReversalProductDto) {}

  async rollback() {}

  async confirmOrder() {}

  async findOne() {}

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

  async changeStatus(idProduct: string, statusProductEnum: StatusProductEnum) {
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
