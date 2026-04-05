import { Injectable, Logger } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { ChangeStatusDto } from './dtos/change-status.dto';
import { ProductRepository } from './repository/product.repository';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { loggerError } from '../utils/logger-error';
import { ClientProxyService } from '../client-proxy/client-proxy.service';

@Injectable()
export class InventoryProductService {
  private readonly logger = new Logger(InventoryProductService.name);
  private serviceOrderClientProxy: ClientProxy;

  constructor(
    private readonly productRepository: ProductRepository,
    clientProxyService: ClientProxyService,
  ) {
    this.serviceOrderClientProxy =
      clientProxyService.getClientProxyServiceOrder();
  }

  async findAll() {
    this.logger.log(`method: ${this.findAll.name}`);
    try {
      return await this.productRepository.findAll();
    } catch (error: any) {
      loggerError(error, this.logger, this.findAll.name);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new RpcException(error.message);
    }
  }

  async findOne(id: string) {
    this.logger.log(`method: ${this.findOne.name}, payload: ${id}`);
    try {
      const product = await this.productRepository.findOneById(id);

      if (!product) throw new RpcException('product not found');

      return product;
    } catch (error: any) {
      loggerError(error, this.logger, this.findOne.name);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error?.path === '_id') throw new RpcException('Type of id invalid');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new RpcException(error.message);
    }
  }

  async findPerStatus() {
    this.logger.log(`method: ${this.findPerStatus.name}`);
    try {
      return await this.productRepository.findPerStatus();
    } catch (error: any) {
      loggerError(error, this.logger, this.findPerStatus.name);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new RpcException(error.message);
    }
  }

  async createProduct(createProductDto: CreateProductDto) {
    this.logger.log(
      `method: ${this.createProduct.name}, payload: ${JSON.stringify(createProductDto)}`,
    );
    try {
      const product =
        await this.productRepository.createProduct(createProductDto);

      this.serviceOrderClientProxy.emit('addProduct-order', {
        idProduct: product._id,
        status: product.status,
        price: product.price,
      });

      return product;
    } catch (error: any) {
      loggerError(error, this.logger, this.createProduct.name);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error?.code === 11000)
        throw new RpcException('key "code" is duplicate');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new RpcException(error?.message);
    }
  }

  async deleteProduct(id: string) {
    this.logger.log(`method: ${this.deleteProduct.name}, id: ${id}`);
    try {
      const product = await this.productRepository.deleteProduct(id);

      if (!product) throw new RpcException('product not found');

      return product;
    } catch (error: any) {
      loggerError(error, this.logger, this.deleteProduct.name);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error?.path === '_id') throw new RpcException('Type of id invalid');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new RpcException(error.message);
    }
  }

  async changeStatus(id: string, changeStatusDto: ChangeStatusDto) {
    this.logger.log(
      `method: ${this.changeStatus.name}, payload: ${id} and ${JSON.stringify(changeStatusDto)}`,
    );
    try {
      const product = await this.productRepository.changeStatus(
        id,
        changeStatusDto,
      );

      if (!product) throw new RpcException('product not found');

      return product;
    } catch (error: any) {
      loggerError(error, this.logger, this.changeStatus.name);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error?.path === '_id') throw new RpcException('Type of id invalid');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new RpcException(error.message);
    }
  }
}
