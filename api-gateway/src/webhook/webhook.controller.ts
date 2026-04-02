import { Controller, Post, Req } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import type { Request } from 'express';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly WebhookService: WebhookService) {}

  @Post('payment-strapi')
  webhookStrapi(@Req() req: Request) {
    return this.WebhookService.webhookStrapi(req);
  }
}
