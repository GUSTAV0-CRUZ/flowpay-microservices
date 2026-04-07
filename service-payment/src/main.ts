import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as amqp from 'amqplib';

async function bootstrap() {
  const rabbitmqUrl = String(process.env.RABBITMQ_URL);
  const exchange = 'service-payment-exchange';
  const queue = 'service-payment';

  try {
    const connection = await amqp.connect(rabbitmqUrl);
    const channel = await connection.createChannel();

    await channel.assertExchange(exchange, 'x-delayed-message', {
      durable: true,
      arguments: {
        'x-delayed-type': 'direct',
      },
    });

    await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(queue, exchange, 'payment-expire');

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('Erro ao configurar infraestrutura do RabbitMQ:', error);
    process.exit(1);
  }

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
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
