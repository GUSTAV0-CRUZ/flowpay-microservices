import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HistoryPaymentSchemaDocument } from '../schemas/history-payment.schema';
import { StatusPaymentEnum } from '../enums/status-payment.enum';
import { CreateHistoryPaymentDto } from '../dtos/create-history-payment.dto';

@Injectable()
export class HistoryPaymentRepository {
  constructor(
    @InjectModel('HistoryPayment')
    private HistoryPaymentModel: Model<HistoryPaymentSchemaDocument>,
  ) {}

  findOneByidPaymentIntent(idPaymentIntent: string) {
    return this.HistoryPaymentModel.findOne({ idPaymentIntent });
  }

  create(createHistoryPaymentDto: CreateHistoryPaymentDto) {
    return this.HistoryPaymentModel.create(createHistoryPaymentDto);
  }

  updateStatus(
    idPaymentIntent: string,
    StatusHistoryPayment: StatusPaymentEnum,
  ) {
    return this.HistoryPaymentModel.findOneAndUpdate(
      { idPaymentIntent },
      { status: StatusHistoryPayment },
      { returnDocument: 'after' },
    ).exec();
  }
}
