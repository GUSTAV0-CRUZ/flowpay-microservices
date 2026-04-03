/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { HistoryPaymentRepository } from './repository/history-payment.repository';
import { StripeService } from '../stripe/stripe.service';
import { RpcException } from '@nestjs/microservices';

describe('PaymentService', () => {
  let paymentService: PaymentService;
  let historyPaymentRepository: HistoryPaymentRepository;
  let stripeService: StripeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: HistoryPaymentRepository,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: StripeService,
          useValue: {
            createPaymentIntent: jest.fn(),
          },
        },
      ],
    }).compile();

    paymentService = module.get<PaymentService>(PaymentService);
    historyPaymentRepository = module.get<HistoryPaymentRepository>(
      HistoryPaymentRepository,
    );
    stripeService = module.get<StripeService>(StripeService);
  });

  it('should be defined', () => {
    expect(paymentService).toBeDefined();
  });

  describe('payment', () => {
    it('should return the idPaymentIntent and clientSecret', async () => {
      const amount = 123;
      const idProduct = 'idProduct123';
      const idPaymentIntent = 'idPaymentIntent123';

      jest.spyOn(stripeService, 'createPaymentIntent').mockResolvedValue({
        id: idPaymentIntent,
        amount,
        client_secret: idPaymentIntent,
      } as any);

      const result = await paymentService.payment({
        idProduct,
        amount,
      });

      expect(stripeService.createPaymentIntent).toHaveBeenCalledWith(
        amount * 100,
        'brl',
      );
      expect(historyPaymentRepository.create).toHaveBeenCalledWith({
        idPaymentIntent,
        idProduct,
        amount,
        currency: 'brl',
      });
      expect(result).toEqual({
        idPaymentIntent,
        clientSecret: idPaymentIntent,
      });
    });

    it('should return generic error: RpcException', async () => {
      jest
        .spyOn(stripeService, 'createPaymentIntent')
        .mockImplementationOnce(() => {
          throw new Error();
        });

      await expect(paymentService.payment({} as any)).rejects.toThrow(
        RpcException,
      );
    });
  });
});
