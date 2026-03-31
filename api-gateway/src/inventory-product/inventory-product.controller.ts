import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateProductDto } from './dtos/create-product.dto';
import { StatusProductEnum } from './enums/status-product.enum';
import { ClientProxyService } from '../client-proxy/client-proxy.service';

@Controller('inventory-product')
export class InventoryProductController {
  private serviceInventoryProduct: ClientProxy;

  constructor(clientProxyService: ClientProxyService) {
    this.serviceInventoryProduct =
      clientProxyService.getClientProxyInventoryProduct();
  }

  @Get()
  findAll() {
    return this.serviceInventoryProduct.send('findAll-inventory', '');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceInventoryProduct.send('findOne-inventory', id);
  }

  // remove methods after tests //////////////////////////////////////////
  // remove-me
  @Get(':id/perStatus')
  findPerStatus() {
    return this.serviceInventoryProduct.send('findPerStatus-inventory', '');
  }

  // remove-me
  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.serviceInventoryProduct.emit(
      'createProduct-inventory',
      createProductDto,
    );
  }

  // remove-me
  @Delete(':id')
  deleteProduct(@Param() id: string) {
    return this.serviceInventoryProduct.emit('deleteProduct-inventory', id);
  }

  // remove-me
  @Patch(':id')
  changeStatus(
    @Param('id') id: string,
    @Body() statusProductEnum: StatusProductEnum,
  ) {
    return this.serviceInventoryProduct.emit('changeStatus-inventory', {
      id,
      statusProductEnum,
    });
  }
  //////////////////////////////////////////////////////////////////////
}
