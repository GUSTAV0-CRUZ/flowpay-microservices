import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentModule } from './payment/payment.module';
import { MongooseModule } from '@nestjs/mongoose';
import { StripeModule } from './stripe/stripe.module';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(String(process.env.MONGODB_URL)),
    PaymentModule,
    StripeModule,
    RabbitmqModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
