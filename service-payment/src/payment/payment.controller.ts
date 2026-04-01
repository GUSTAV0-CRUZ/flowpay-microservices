import { Controller, Post, Req } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PaymentService } from './payment.service';
import { PaymentDto } from './dtos/payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @EventPattern('payment')
  async payment(@Payload() paymentDto: PaymentDto) {
    await this.paymentService.payment(paymentDto);
  }

  @EventPattern('refund')
  async refund(@Payload() refund: string) {
    await this.paymentService.refund(refund);
  }

  @Post('webhook')
  async handleWebHook(@Req() req: Request) {
    await this.paymentService.handleWebHook(req);
  }
}
