import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { HistoryPaymentRepository } from './repository/history-payment.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { HistorySchemaPayment } from './schemas/history-payment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'HistoryPayment', schema: HistorySchemaPayment },
    ]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, HistoryPaymentRepository],
})
export class PaymentModule {}
