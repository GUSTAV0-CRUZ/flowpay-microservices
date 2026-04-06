import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { ClientProxyModule } from 'src/client-proxy/client-proxy.module';

@Module({
  imports: [ClientProxyModule],
  controllers: [OrderController],
})
export class OrderModule {}
