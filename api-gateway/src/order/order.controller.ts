import { Body, Controller, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { BuyProductDto } from './dtos/buy-product.dto';
import { ClientProxyService } from '../client-proxy/client-proxy.service';
import { ReversalProductDto } from './dtos/reversal-product.dto';

@Controller('order')
export class OrderController {
  private serviceOrderClientProxy: ClientProxy;

  constructor(clientProxyService: ClientProxyService) {
    this.serviceOrderClientProxy =
      clientProxyService.getClientProxyServiceOrder();
  }

  @Post('buyProduct')
  buyProduct(@Body() buyProductDto: BuyProductDto) {
    console.log(buyProductDto);
    return this.serviceOrderClientProxy.send('buyProduct-order', buyProductDto);
  }

  @Post('reversalProduct')
  reversalProduct(@Body() reversalProductDto: ReversalProductDto) {
    return this.serviceOrderClientProxy.emit(
      'reversalProduct-order',
      reversalProductDto,
    );
  }
}
