import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateProductDto } from './dtos/create-product.dto';
import { InventoryProductService } from './inventory-product.service';
import { ChangeStatusInterface } from './interfaces/change-status.interface';

@Controller('inventory-product')
export class InventoryProductController {
  constructor(
    private readonly inventoryProductService: InventoryProductService,
  ) {}

  @MessagePattern('findAll-inventory')
  findAll() {
    return this.inventoryProductService.findAll();
  }

  @MessagePattern('findOne-inventory')
  findOne(@Payload() id: string) {
    return this.inventoryProductService.findOne(id);
  }

  @MessagePattern('findPerStatus-inventory')
  findPerStatus() {
    return this.inventoryProductService.findPerStatus();
  }

  @EventPattern('createProduct-inventory')
  createProduct(@Payload() createProductDto: CreateProductDto) {
    return this.inventoryProductService.createProduct(createProductDto);
  }

  @EventPattern('deleteProduct-inventory')
  deleteProduct(@Payload() id: string) {
    return this.inventoryProductService.deleteProduct(id);
  }

  @EventPattern('changeStatus-inventory')
  changeStatus(@Payload() changeStatusInterface: ChangeStatusInterface) {
    const { id, changeStatusDto } = changeStatusInterface;
    return this.inventoryProductService.changeStatus(id, changeStatusDto);
  }
}
