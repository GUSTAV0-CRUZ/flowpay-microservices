import { ChangeStatusDto } from '../dtos/change-status.dto';
import { CreateProductDto } from '../dtos/create-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductSchemaDocument } from '../schemas/product.schema';
import { StatusProductEnum } from '../enums/status-product.enum';

export class ProductRepository {
  constructor(
    @InjectModel('Product')
    private productSchema: Model<ProductSchemaDocument>,
  ) {}

  findAll() {
    return this.productSchema.find();
  }

  findOne(id: string) {
    return this.productSchema.findById(id);
  }

  findPerStatus() {
    return this.productSchema
      .find()
      .where({ status: StatusProductEnum.AVAILABLE })
      .exec();
  }

  createProduct(createProductDto: CreateProductDto) {
    return this.productSchema.create(createProductDto);
  }

  deleteProduct(id: string) {
    return this.productSchema.findByIdAndDelete(id);
  }

  changeStatus(id: string, changeStatusDto: ChangeStatusDto) {
    return this.productSchema
      .findByIdAndUpdate(id, changeStatusDto, { returnDocument: 'after' })
      .exec();
  }
}
