import { Module } from '@nestjs/common';
import { InventoryProductController } from './inventory-product.controller';
import { InventoryProductService } from './inventory-product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './schemas/product.schema';
import { ProductRepository } from './repository/product.repository';
import { ClientProxyModule } from 'src/client-proxy/client-proxy.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
    ClientProxyModule,
  ],
  controllers: [InventoryProductController],
  providers: [InventoryProductService, ProductRepository],
})
export class InventoryProductModule {}
