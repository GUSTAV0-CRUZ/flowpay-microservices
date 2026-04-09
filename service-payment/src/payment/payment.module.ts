import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { HistoryPaymentRepository } from './repository/history-payment.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { HistorySchemaPayment } from './schemas/history-payment.schema';
import { StripeModule } from 'src/stripe/stripe.module';
import { ClientProxyModule } from 'src/client-proxy/client-proxy.module';
import { RabbitmqModule } from 'src/rabbitmq/rabbitmq.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'HistoryPayment', schema: HistorySchemaPayment },
    ]),
    StripeModule,
    ClientProxyModule,
    RabbitmqModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService, HistoryPaymentRepository],
})
export class PaymentModule {}
