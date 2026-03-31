import { Module } from '@nestjs/common';
import { InventoryProductController } from './inventory-product.controller';
import { ClientProxyModule } from 'src/client-proxy/client-proxy.module';

@Module({
  imports: [ClientProxyModule],
  controllers: [InventoryProductController],
})
export class InventoryProductModule {}
