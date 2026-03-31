import { Injectable, Logger } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { ChangeStatusDto } from './dtos/change-status.dto';

@Injectable()
export class InventoryProductService {
  private readonly logger = new Logger(InventoryProductService.name);

  findAll() {
    this.logger.log(`method: ${this.findAll.name}`);
    return 'findAll';
  }

  findOne(id: string) {
    this.logger.log(`method: ${this.findOne.name}, payload: ${id}`);
    return `finOne: ${id}`;
  }

  findPerStatus() {
    this.logger.log(`method: ${this.findPerStatus.name}`);
    return 'finPerstatus';
  }

  createProduct(createProductDto: CreateProductDto) {
    this.logger.log(
      `method: ${this.createProduct.name}, payload: ${JSON.stringify(createProductDto)}`,
    );
    return `createProduct: ${createProductDto.name}`;
  }

  deleteProduct(id: string) {
    this.logger.log(`method: ${this.deleteProduct.name}`);
    return `deleteProduct: ${id}`;
  }

  changeStatus(id: string, changeStatusDto: ChangeStatusDto) {
    this.logger.log(
      `method: ${this.changeStatus.name}, payload: ${id} and ${JSON.stringify(changeStatusDto)}`,
    );
    return `changeStatus: id - ${id}, status - ${changeStatusDto.status}`;
  }
}
