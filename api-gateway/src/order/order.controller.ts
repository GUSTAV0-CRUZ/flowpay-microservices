import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { BuyProductDto } from './dtos/buy-product.dto';
import { ClientProxyService } from '../client-proxy/client-proxy.service';
import { ReversalProductDto } from './dtos/reversal-product.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('order')
export class OrderController {
  private serviceOrderClientProxy: ClientProxy;

  constructor(clientProxyService: ClientProxyService) {
    this.serviceOrderClientProxy =
      clientProxyService.getClientProxyServiceOrder();
  }

  @ApiResponse({
    status: 201,
    schema: {
      type: 'object',
      properties: {
        idPaymentIntent: { type: 'string' },
        clientSecret: { type: 'string' },
      },
    },
  })
  @Post('buyProduct')
  buyProduct(@Body() buyProductDto: BuyProductDto) {
    return this.serviceOrderClientProxy.send('buyProduct-order', buyProductDto);
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Post('reversalProduct')
  reversalProduct(@Body() reversalProductDto: ReversalProductDto) {
    return this.serviceOrderClientProxy.emit(
      'reversalProduct-order',
      reversalProductDto,
    );
  }
}
