import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        noAck: false,
        queue: 'service-payment',
        urls: [String(process.env.RABBITMQ_URL)],
        queueOptions: {
          durable: true,
          exchange: 'service-payment-exchange',
          exchangeType: 'x-delayed-message',
          arguments: { 'x-delayed-type': 'direct' },
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
