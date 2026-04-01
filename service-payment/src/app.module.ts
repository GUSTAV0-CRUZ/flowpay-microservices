import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PaymentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
