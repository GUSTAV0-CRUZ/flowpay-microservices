import { Controller, Post, Req } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import type { Request } from 'express';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('webhook')
export class WebhookController {
  constructor(private readonly WebhookService: WebhookService) {}

  @Post('payment-stripe')
  webhookStrapi(@Req() req: Request) {
    return this.WebhookService.webhookStrapi(req);
  }
}
