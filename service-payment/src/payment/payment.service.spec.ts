/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { HistoryPaymentRepository } from './repository/history-payment.repository';
import { StripeService } from '../stripe/stripe.service';
import { RpcException } from '@nestjs/microservices';
import { StatusPaymentEnum } from './enums/status-payment.enum';

const createHistoryPayment = () => ({
  amount: 123,
  idProduct: 'idProduct123',
  idPaymentIntent: 'idPaymentIntent123',
  status: StatusPaymentEnum.PENDING,
});

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
            findByIdProductStatusPaid: jest.fn(),
            updateStatus: jest.fn(),
          },
        },
        {
          provide: StripeService,
          useValue: {
            createPaymentIntent: jest.fn(),
            refundPayment: jest.fn(),
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

  describe('refund', () => {
    it('should return idPaymentIntent', async () => {
      const historyPayment = createHistoryPayment();

      jest
        .spyOn(historyPaymentRepository, 'findByIdProductStatusPaid')
        .mockResolvedValue(historyPayment as any);
      jest.spyOn(stripeService, 'refundPayment').mockResolvedValue({} as any);
      jest
        .spyOn(historyPaymentRepository, 'updateStatus')
        .mockResolvedValue({} as any);

      const result = await paymentService.refund(historyPayment.idProduct);

      expect(
        historyPaymentRepository.findByIdProductStatusPaid,
      ).toHaveBeenCalledWith(historyPayment.idProduct);
      expect(stripeService.refundPayment).toHaveBeenCalledWith(
        historyPayment.idPaymentIntent,
      );
      expect(historyPaymentRepository.updateStatus).toHaveBeenCalledWith(
        historyPayment.idPaymentIntent,
        StatusPaymentEnum.REFUNDED,
      );
      expect(result).toEqual(historyPayment.idPaymentIntent);
    });

    it('should return error: historyPayment not found', async () => {
      await expect(paymentService.refund({} as any)).rejects.toThrow(
        'historyPayment not found',
      );
    });

    it('should return generic error: RpcException', async () => {
      jest
        .spyOn(historyPaymentRepository, 'findByIdProductStatusPaid')
        .mockImplementationOnce(() => {
          throw new Error();
        });

      await expect(paymentService.refund({} as any)).rejects.toThrow(
        RpcException,
      );
    });
  });
});
