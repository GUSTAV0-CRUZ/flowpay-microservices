/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { HistoryPaymentRepository } from './repository/history-payment.repository';
import { StripeService } from '../stripe/stripe.service';
import { RpcException } from '@nestjs/microservices';
import { StatusPaymentEnum } from './enums/status-payment.enum';
import { ClientProxyService } from '../client-proxy/client-proxy.service';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';

const createHistoryPayment = (status?: StatusPaymentEnum) => ({
  amount: 123,
  idProduct: 'idProduct123',
  idPaymentIntent: 'idPaymentIntent123',
  status: status ?? StatusPaymentEnum.PENDING,
});

describe('PaymentService', () => {
  let paymentService: PaymentService;
  let historyPaymentRepository: HistoryPaymentRepository;
  let stripeService: StripeService;
  let rabbitmqService: RabbitmqService;

  const serviceOrderClientProxy = {
    emit: jest.fn(),
    send: jest.fn(),
  };

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
            findOneByIdPaymentIntent: jest.fn(),
          },
        },
        {
          provide: StripeService,
          useValue: {
            createPaymentIntent: jest.fn(),
            refundPayment: jest.fn(),
            cancelPayment: jest.fn(),
          },
        },
        {
          provide: RabbitmqService,
          useValue: {
            publishDelayedMessage: jest.fn(),
          },
        },
        {
          provide: ClientProxyService,
          useValue: {
            getClientProxyServiceOrder: () => serviceOrderClientProxy,
          },
        },
      ],
    }).compile();

    paymentService = module.get<PaymentService>(PaymentService);
    historyPaymentRepository = module.get<HistoryPaymentRepository>(
      HistoryPaymentRepository,
    );
    stripeService = module.get<StripeService>(StripeService);
    rabbitmqService = module.get<RabbitmqService>(RabbitmqService);
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

      jest.spyOn(rabbitmqService, 'publishDelayedMessage');

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
      expect(rabbitmqService.publishDelayedMessage).toHaveBeenCalledWith(
        'service-payment-exchange',
        'payment-expire',
        idPaymentIntent,
        6000000,
      );
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

  describe('paymentSucceeded', () => {
    it('should return historyPayment', async () => {
      const historyPayment = createHistoryPayment();

      jest
        .spyOn(historyPaymentRepository, 'updateStatus')
        .mockResolvedValue(historyPayment as any);
      jest.spyOn(serviceOrderClientProxy, 'emit');

      const result = await paymentService.paymentSucceeded({
        paymentIntentId: historyPayment.idPaymentIntent,
      });

      expect(historyPaymentRepository.updateStatus).toHaveBeenCalledWith(
        historyPayment.idPaymentIntent,
        StatusPaymentEnum.PAID,
      );
      expect(serviceOrderClientProxy.emit).toHaveBeenCalledWith(
        'confirmOrder-order',
        {
          idProduct: historyPayment.idProduct,
        },
      );
      expect(result).toEqual(historyPayment);
    });

    it('should return generic error: RpcException', async () => {
      jest
        .spyOn(historyPaymentRepository, 'updateStatus')
        .mockImplementationOnce(() => {
          throw new Error();
        });

      await expect(paymentService.paymentSucceeded({} as any)).rejects.toThrow(
        RpcException,
      );
    });
  });

  describe('paymentFailed', () => {
    it('should return historyPayment', async () => {
      const historyPayment = createHistoryPayment();

      jest
        .spyOn(historyPaymentRepository, 'updateStatus')
        .mockResolvedValue(historyPayment as any);
      jest.spyOn(stripeService, 'cancelPayment');

      const result = await paymentService.paymentFailed({
        paymentIntentId: historyPayment.idPaymentIntent,
      });

      expect(historyPaymentRepository.updateStatus).toHaveBeenCalledWith(
        historyPayment.idPaymentIntent,
        StatusPaymentEnum.FAILED,
      );
      expect(stripeService.cancelPayment).toHaveBeenCalledWith(
        historyPayment.idPaymentIntent,
      );
      expect(result).toEqual(historyPayment);
    });

    it('should return generic error: RpcException', async () => {
      jest
        .spyOn(historyPaymentRepository, 'updateStatus')
        .mockImplementationOnce(() => {
          throw new Error();
        });

      await expect(paymentService.paymentFailed({} as any)).rejects.toThrow(
        RpcException,
      );
    });
  });

  describe('paymentCanceled', () => {
    it('should return historyPayment', async () => {
      const status = StatusPaymentEnum.CANCELED;
      const historyPayment = createHistoryPayment(status);

      jest
        .spyOn(historyPaymentRepository, 'updateStatus')
        .mockResolvedValue(historyPayment as any);
      jest.spyOn(stripeService, 'cancelPayment');

      const result = await paymentService.paymentCanceled({
        paymentIntentId: historyPayment.idPaymentIntent,
      });

      expect(historyPaymentRepository.updateStatus).toHaveBeenCalledWith(
        historyPayment.idPaymentIntent,
        StatusPaymentEnum.CANCELED,
      );
      expect(result).toEqual(historyPayment);
    });

    it('should return generic error: RpcException', async () => {
      jest
        .spyOn(historyPaymentRepository, 'updateStatus')
        .mockImplementationOnce(() => {
          throw new Error();
        });

      await expect(paymentService.paymentCanceled({} as any)).rejects.toThrow(
        RpcException,
      );
    });
  });

  describe('expirePayment', () => {
    it('should return paymentIntentId', async () => {
      const status = StatusPaymentEnum.PENDING;
      const historyPayment = createHistoryPayment(status);

      jest
        .spyOn(historyPaymentRepository, 'findOneByIdPaymentIntent')
        .mockResolvedValue(historyPayment as any);
      jest.spyOn(stripeService, 'cancelPayment');

      const result = await paymentService.expirePayment(
        historyPayment.idPaymentIntent,
      );

      expect(
        historyPaymentRepository.findOneByIdPaymentIntent,
      ).toHaveBeenCalledWith(historyPayment.idPaymentIntent);
      expect(stripeService.cancelPayment).toHaveBeenCalledWith(
        historyPayment.idPaymentIntent,
      );
      expect(result).toEqual(historyPayment);
    });

    it('should return error: Paiment not found', async () => {
      jest
        .spyOn(historyPaymentRepository, 'findOneByIdPaymentIntent')
        .mockResolvedValue(null);

      await expect(paymentService.expirePayment({} as any)).rejects.toThrow(
        'Paiment not found',
      );
    });

    it('should return error: Paiment not PENDING', async () => {
      const status = StatusPaymentEnum.PAID;
      const historyPayment = createHistoryPayment(status);

      jest
        .spyOn(historyPaymentRepository, 'findOneByIdPaymentIntent')
        .mockResolvedValue(historyPayment as any);

      await expect(paymentService.expirePayment({} as any)).rejects.toThrow(
        'Paiment not PENDING',
      );
    });

    it('should return generic error: RpcException', async () => {
      jest
        .spyOn(historyPaymentRepository, 'findOneByIdPaymentIntent')
        .mockImplementationOnce(() => {
          throw new Error();
        });

      await expect(paymentService.expirePayment({} as any)).rejects.toThrow(
        RpcException,
      );
    });
  });
});
