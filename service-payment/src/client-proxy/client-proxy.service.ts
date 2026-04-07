import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class ClientProxyService {
  constructor(private readonly configService: ConfigService) {}

  getClientProxyServiceOrder() {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [String(this.configService.get('RABBITMQ_URL'))],
        queue: 'service-order',
        queueOptions: {
          durable: true,
        },
      },
    });
  }

  getClientProxyServicePayment() {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [String(this.configService.get('RABBITMQ_URL'))],
        queue: 'service-payment',
        queueOptions: {
          durable: true,
        },
      },
    });
  }
}
