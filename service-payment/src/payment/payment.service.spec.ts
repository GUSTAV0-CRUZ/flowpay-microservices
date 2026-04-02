import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { HistoryPaymentRepository } from './repository/history-payment.repository';
import { StripeService } from '../stripe/stripe.service';

describe('PaymentService', () => {
  let service: PaymentService;
  let historyPaymentRepository: HistoryPaymentRepository;
  let stripeService: StripeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: HistoryPaymentRepository,
          useValue: {},
        },
        {
          provide: StripeService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    historyPaymentRepository = module.get<HistoryPaymentRepository>(
      HistoryPaymentRepository,
    );
    stripeService = module.get<StripeService>(StripeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
