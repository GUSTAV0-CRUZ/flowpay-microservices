import { Module } from '@nestjs/common';
import { InventoryProductController } from './inventory-product.controller';
import { InventoryProductService } from './inventory-product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
  ],
  controllers: [InventoryProductController],
  providers: [InventoryProductService],
})
export class InventoryProductModule {}
