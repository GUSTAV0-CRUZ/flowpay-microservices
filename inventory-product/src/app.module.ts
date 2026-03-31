import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InventoryProductModule } from './inventory-product/inventory-product.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(String(process.env.MONGODB_URL)),
    InventoryProductModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
