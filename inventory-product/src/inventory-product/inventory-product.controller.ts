import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

@Controller('inventory-product')
export class InventoryProductController {
  @MessagePattern('findAll-inventory')
  findAll() {}

  @MessagePattern('findOne-inventory')
  findOne() {}

  @MessagePattern('findPerStatus-inventory')
  findPerStatus() {}

  @EventPattern('createProduct-inventory')
  createProduct() {}

  @EventPattern('deleteProduct-inventory')
  deleteProduct() {}

  @EventPattern('changeStatus-inventory')
  changeStatus() {}
}
