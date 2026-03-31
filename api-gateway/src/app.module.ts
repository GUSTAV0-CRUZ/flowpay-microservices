import { Module } from '@nestjs/common';
import { ClientProxyModule } from './client-proxy/client-proxy.module';
import { ConfigModule } from '@nestjs/config';
import { InventoryProductModule } from './inventory-product/inventory-product.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClientProxyModule,
    InventoryProductModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
