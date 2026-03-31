import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class ClientProxyService {
  constructor(private readonly configService: ConfigService) {}

  getClientProxyInventoryProduct() {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [String(this.configService.get('REBBITMQ_URL'))],
        queue: 'inventory-product',
        queueOptions: {
          durable: true,
        },
      },
    });
  }
}
