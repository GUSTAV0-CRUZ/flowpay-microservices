import { Module } from '@nestjs/common';
import { ClientProxyModule } from './client-proxy/client-proxy.module';
import { ConfigModule } from '@nestjs/config';
import { InventoryProductModule } from './inventory-product/inventory-product.module';
import { WebhookModule } from './webhook/webhook.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClientProxyModule,
    InventoryProductModule,
    WebhookModule,
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
