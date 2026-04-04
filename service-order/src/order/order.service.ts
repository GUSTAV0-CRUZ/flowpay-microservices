import { Injectable } from '@nestjs/common';
import { BuyProductDto } from './dtos/buy-product.dto';
import { ReversalProductDto } from './dtos/reversal-product.dto';
import { AddProductDto } from './dtos/add-product.dto';
import { RemoveProductDto } from './dtos/remove-product.dto';
import { OrderRepository } from './repository/order.respository';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async buyProduct(buyProductDto: BuyProductDto) {}

  async reversalProduct(reversalProductDto: ReversalProductDto) {}

  async rollback() {}

  async confirmOrder() {}

  async findOne() {}

  async addProduct(addProductDto: AddProductDto) {}

  async removeProduct(removeProductDto: RemoveProductDto) {}

  async changeStatus() {}
}
