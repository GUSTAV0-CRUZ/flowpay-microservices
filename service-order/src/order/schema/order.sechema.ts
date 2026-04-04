import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Order } from '../entities/order.entities';
import { StatusProductEnum } from '../enums/status-product.enum';
import { Document } from 'mongoose';

export type orderSchemaDocument = Document & OrderSchemaDb;

@Schema({ timestamps: true })
export class OrderSchemaDb implements Order {
  @Prop({ type: String, required: true, unique: true })
  idProduct: string;

  @Prop({ type: String, required: true, enum: StatusProductEnum })
  status: StatusProductEnum;
}

export const OrderSchema = SchemaFactory.createForClass(OrderSchemaDb);
