import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { StripeModule } from 'src/stripe/stripe.module';
import { ClientProxyModule } from 'src/client-proxy/client-proxy.module';

@Module({
  imports: [StripeModule, ClientProxyModule],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
