import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitmqService implements OnModuleInit, OnModuleDestroy {
  private connection!: amqp.ChannelModel;
  private channel!: amqp.Channel;

  async onModuleInit(): Promise<void> {
    const url = process.env.RABBITMQ_URL;

    if (!url) throw new Error('RABBITMQ_URL not defined');

    this.connection = await amqp.connect(url);
    this.channel = await this.connection.createChannel();

    await this.channel.assertExchange(
      'service-payment-exchange',
      'x-delayed-message',
      {
        durable: true,
        arguments: {
          'x-delayed-type': 'direct',
        },
      },
    );

    await this.channel.assertQueue('service-payment', {
      durable: true,
    });

    await this.channel.bindQueue(
      'service-payment',
      'service-payment-exchange',
      'payment-expire',
    );
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async publishDelayedMessage(
    exchange: string,
    routingKey: string,
    message: any,
    delay: number,
  ): Promise<void> {
    if (!this.channel) throw new Error('Channel not initialized');
    const test = {
      pattern: routingKey,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: message,
    };

    this.channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(test)),
      {
        headers: {
          'x-delay': delay,
        },
      },
    );
  }

  async onModuleDestroy(): Promise<void> {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
  }
}
