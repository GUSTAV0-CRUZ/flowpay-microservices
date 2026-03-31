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
import { ClientProxyService } from '../client-proxy/client-proxy.service';
import { ChangeStatusDto } from './dtos/change-status.dto';

@Controller('inventory-product')
export class InventoryProductController {
  private serviceInventoryProduct: ClientProxy;

  constructor(clientProxyService: ClientProxyService) {
    this.serviceInventoryProduct =
      clientProxyService.getClientProxyInventoryProduct();
  }

  @Get(':id/perStatus')
  findAllStatusAvailable() {
    return this.serviceInventoryProduct.send('findPerStatus-inventory', '');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceInventoryProduct.send('findOne-inventory', id);
  }

  // remove methods after tests //////////////////////////////////////////
  // remove-me
  @Get()
  findAll() {
    return this.serviceInventoryProduct.send('findAll-inventory', '');
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
  deleteProduct(@Param('id') id: string) {
    return this.serviceInventoryProduct.emit('deleteProduct-inventory', id);
  }

  // remove-me
  @Patch(':id')
  changeStatus(
    @Param('id') id: string,
    @Body() changeStatusDto: ChangeStatusDto,
  ) {
    return this.serviceInventoryProduct.emit('changeStatus-inventory', {
      id,
      changeStatusDto,
    });
  }
  //////////////////////////////////////////////////////////////////////
}
