import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { orderSchemaDocument } from '../schema/order.sechema';
import { InjectModel } from '@nestjs/mongoose';
import { AddProductDto } from '../dtos/add-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectModel('Order')
    private readonly orderModel: Model<orderSchemaDocument>,
  ) {}

  findOneByIdProduct(idProduct: string) {
    return this.orderModel.findOne({ idProduct }).exec();
  }

  removeProduct(idProduct: string) {
    return this.orderModel.findOneAndDelete({ idProduct }).exec();
  }

  addProduct(addProductDto: AddProductDto) {
    return this.orderModel.create(addProductDto);
  }

  changeStatus(idProduct: string, updateProductDto: UpdateProductDto) {
    return this.orderModel
      .findOneAndUpdate({ idProduct }, updateProductDto, {
        returnDocument: 'after',
      })
      .exec();
  }
}
