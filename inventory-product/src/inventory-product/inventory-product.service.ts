import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { StatusProductEnum } from './enums/status-product.enum';

@Injectable()
export class InventoryProductService {
  findAll() {
    return 'findAll';
  }

  findOne(id: string) {
    return `finOne: ${id}`;
  }

  findPerStatus() {}

  createProduct(createProductDto: CreateProductDto) {
    return `createProduct: ${createProductDto.name}`;
  }

  deleteProduct(id: string) {
    return `deleteProduct: ${id}`;
  }

  changeStatus(id: string, statusProduct: StatusProductEnum) {
    return `changeStatus: id - ${id}, status - ${statusProduct}`;
  }
}
