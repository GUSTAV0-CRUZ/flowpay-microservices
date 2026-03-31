import { Module } from '@nestjs/common';
import { InventoryProductController } from './inventory-product.controller';
import { InventoryProductService } from './inventory-product.service';

@Module({
  controllers: [InventoryProductController],
  providers: [InventoryProductService],
})
export class InventoryProductModule {}
