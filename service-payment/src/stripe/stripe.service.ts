import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY') || '',
      {
        apiVersion: '2026-03-25.dahlia',
      },
    );
  }

  createPaymentIntent(
    amount: number,
    currency: string,
    idempotencyKey: string,
  ) {
    return this.stripe.paymentIntents.create(
      {
        amount,
        currency,
        automatic_payment_methods: { enabled: true },
      },
      {
        idempotencyKey,
      },
    );
  }

  refundPayment(idPaymentIntent: string, amount?: number) {
    return this.stripe.refunds.create({
      payment_intent: idPaymentIntent,
      amount,
    });
  }

  cancelPayment(idPaymentIntent: string) {
    return this.stripe.paymentIntents.cancel(idPaymentIntent, {
      cancellation_reason: 'abandoned',
    });
  }
}
