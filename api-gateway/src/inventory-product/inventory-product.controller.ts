import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateProductDto } from './dtos/create-product.dto';
import { ClientProxyService } from '../client-proxy/client-proxy.service';
import { ApiResponse } from '@nestjs/swagger';
import { ProductResponseDto } from './dtos/product-response.dto';

@Controller('inventory-product')
export class InventoryProductController {
  private serviceInventoryProduct: ClientProxy;

  constructor(clientProxyService: ClientProxyService) {
    this.serviceInventoryProduct =
      clientProxyService.getClientProxyInventoryProduct();
  }

  @ApiResponse({
    status: 200,
    type: [ProductResponseDto],
  })
  @Get('/perStatus')
  findAllStatusAvailable() {
    return this.serviceInventoryProduct.send('findPerStatus-inventory', '');
  }

  @ApiResponse({
    status: 200,
    type: ProductResponseDto,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceInventoryProduct.send('findOne-inventory', id);
  }

  //////////////////////////////////////////////////
  // For testing purposes only, it should be enabled
  // for only one user with an admin role.

  // remove-me
  @ApiResponse({
    status: 200,
    type: [ProductResponseDto],
  })
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
  //////////////////////////////////////////////////////////////////////
}
