import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Product } from '../entities/Product.entitie';
import { StatusProductEnum } from '../enums/status-product.enum';
import { Document } from 'mongoose';

export type ProductSchemaDocument = Document & ProductSchemaDb;

@Schema({ timestamps: true })
export class ProductSchemaDb implements Product {
  @Prop({ type: String, isRequired: true })
  name: string;

  @Prop({ type: Number, isRequired: true })
  price: number;

  @Prop({ type: String, isRequired: true, unique: true })
  code: string;

  @Prop({
    type: String,
    enum: StatusProductEnum,
    isRequired: true,
    default: StatusProductEnum.AVAILABLE,
  })
  status: StatusProductEnum;
}

export const ProductSchema = SchemaFactory.createForClass(ProductSchemaDb);
