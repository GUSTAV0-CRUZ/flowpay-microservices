import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InventoryProductModule } from './inventory-product/inventory-product.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), InventoryProductModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
