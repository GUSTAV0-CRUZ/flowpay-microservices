import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { HistoryPayment } from '../entities/history-payment.entitie';
import { StatusPaymentEnum } from '../enums/status-payment.enum';

export type HistoryPaymentSchemaDocument = Document & HistoryPaymentSchemaDb;

@Schema({ timestamps: true })
export class HistoryPaymentSchemaDb implements HistoryPayment {
  @Prop({ type: String, isRequired: true, unique: true })
  idPaymentIntent: string;

  @Prop({ type: String, isRequired: true })
  idProduct: string;

  @Prop({ type: Number, isRequired: true })
  amount: number;

  @Prop({
    type: String,
    enum: StatusPaymentEnum,
    isRequired: true,
    default: StatusPaymentEnum.PENDING,
  })
  status: StatusPaymentEnum;

  @Prop({ type: String, isRequired: true })
  currency: string;
}

export const HistorySchemaPayment = SchemaFactory.createForClass(
  HistoryPaymentSchemaDb,
);
