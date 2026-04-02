import { Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';
import { ClientProxyService } from 'src/client-proxy/client-proxy.service';
import { StripeService } from 'src/stripe/stripe.service';
import Stripe from 'stripe';

@Injectable()
export class WebhookService {
  private stripe: Stripe;
  private servicePaymentClientProxy: ClientProxy;

  constructor(
    stripeService: StripeService,
    clientProxyService: ClientProxyService,
  ) {
    this.stripe = stripeService.getStripe();
    this.servicePaymentClientProxy =
      clientProxyService.getClientProxyServicePayment();
  }

  webhookStrapi(req: Request) {
    const event = this.stripe.webhooks.constructEvent(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      req.body,
      req.headers['stripe-signature'] || '',
      String(process.env.STRIPE_WEBHOOK_SECRET),
    );

    if (event.type === 'payment_intent.succeeded') {
      return this.servicePaymentClientProxy.emit('payment-succeeded', {
        paymentIntentId: event.data.object,
      });
    }

    if (event.type === 'payment_intent.payment_failed') {
      return this.servicePaymentClientProxy.emit('payment-failed', {
        paymentIntentId: event?.data?.object,
      });
    }
  }
}
