import { Test, TestingModule } from '@nestjs/testing';
import { WebhookService } from './webhook.service';
import { StripeService } from '../stripe/stripe.service';
import { ClientProxyService } from '../client-proxy/client-proxy.service';

describe('WebhookService', () => {
  let service: WebhookService;
  let stripeService: StripeService;
  let clientProxyService: ClientProxyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebhookService,
        {
          provide: StripeService,
          useValue: {
            getStripe: jest.fn(),
          },
        },
        {
          provide: ClientProxyService,
          useValue: {
            getClientProxyServicePayment: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<WebhookService>(WebhookService);
    stripeService = module.get<StripeService>(StripeService);
    clientProxyService = module.get<ClientProxyService>(ClientProxyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
