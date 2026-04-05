/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { OrderRepository } from './repository/order.respository';
import { ClientProxyService } from '../client-proxy/client-proxy.service';
import { StatusProductEnum } from './enums/status-product.enum';
import { of } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

describe('OrderService', () => {
  let orderService: OrderService;
  let orderRepository: OrderRepository;

  const inventoryProductClientProxy = {
    send: jest.fn(),
    emit: jest.fn(),
  };

  const servicePaymentClientProxy = {
    send: jest.fn(),
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: OrderRepository,
          useValue: {
            findOneByIdProduct: jest.fn(),
            changeStatus: jest.fn(),
          },
        },
        {
          provide: ClientProxyService,
          useValue: {
            getClientProxyInventoryProduct: () => inventoryProductClientProxy,
            getClientProxyServicePayment: () => servicePaymentClientProxy,
          },
        },
      ],
    }).compile();

    orderService = module.get<OrderService>(OrderService);
    orderRepository = module.get<OrderRepository>(OrderRepository);
  });

  it('should be defined', () => {
    expect(orderService).toBeDefined();
  });

  describe('buyProduct', () => {
    it('should return paymentIntent', async () => {
      const idProduct = 'idProduct123';
      const price = 1200;
      const status = StatusProductEnum.AVAILABLE;

      jest
        .spyOn(orderRepository, 'findOneByIdProduct')
        .mockResolvedValue({ idProduct, price, status } as any);
      jest.spyOn(servicePaymentClientProxy, 'send').mockReturnValue(
        of({
          idPaymentIntent: 'idPaymentIntent',
          clientSecret: 'clientSecret',
        }),
      );
      jest
        .spyOn(orderRepository, 'changeStatus')
        .mockResolvedValue({ idProduct } as any);
      jest.spyOn(inventoryProductClientProxy, 'emit');

      const result = await orderService.buyProduct({ idProduct });

      expect(orderRepository.findOneByIdProduct).toHaveBeenCalledWith(
        idProduct,
      );
      expect(servicePaymentClientProxy.send).toHaveBeenCalledWith('payment', {
        idProduct,
        amount: price,
      });
      expect(orderRepository.changeStatus).toHaveBeenCalledWith(
        idProduct,
        StatusProductEnum.RESERVED,
      );
      expect(inventoryProductClientProxy.emit).toHaveBeenCalledWith(
        'changeStatus-inventory',
        {
          id: idProduct,
          changeStatusDto: StatusProductEnum.RESERVED,
        },
      );

      expect(result).toEqual({
        idPaymentIntent: 'idPaymentIntent',
        clientSecret: 'clientSecret',
      });
    });

    it('should return error: Product not found', async () => {
      await expect(orderService.buyProduct({} as any)).rejects.toThrow(
        'Product not found',
      );
    });

    it('should return error: Product not AVAILABLE', async () => {
      jest
        .spyOn(orderRepository, 'findOneByIdProduct')
        .mockResolvedValue({ status: StatusProductEnum.RESERVED } as any);

      await expect(orderService.buyProduct({} as any)).rejects.toThrow(
        'Product not AVAILABLE',
      );
    });

    it('should return generic error: RpcException', async () => {
      jest
        .spyOn(orderRepository, 'findOneByIdProduct')
        .mockRejectedValue(() => {
          throw new Error();
        });

      await expect(orderService.buyProduct({} as any)).rejects.toThrow(
        RpcException,
      );
    });
  });

  describe('reversalProduct', () => {
    it('should return idProduct', async () => {
      const idProduct = 'idProduct123';
      const status = StatusProductEnum.SOLDOUT;

      jest
        .spyOn(orderRepository, 'findOneByIdProduct')
        .mockResolvedValue({ idProduct, status } as any);
      jest.spyOn(servicePaymentClientProxy, 'emit');
      jest.spyOn(orderService, 'rollback').mockResolvedValue({} as any);

      const result = await orderService.reversalProduct({ idProduct });

      expect(orderRepository.findOneByIdProduct).toHaveBeenCalledWith(
        idProduct,
      );
      expect(servicePaymentClientProxy.emit).toHaveBeenCalledWith(
        'refund',
        idProduct,
      );
      expect(orderService.rollback).toHaveBeenCalledWith({ idProduct });

      expect(result).toEqual(idProduct);
    });

    it('should return error: Product not found', async () => {
      await expect(orderService.reversalProduct({} as any)).rejects.toThrow(
        'Product not found',
      );
    });

    it('should return error: Product not SOLDOUT', async () => {
      jest
        .spyOn(orderRepository, 'findOneByIdProduct')
        .mockResolvedValue({ status: StatusProductEnum.RESERVED } as any);

      await expect(orderService.reversalProduct({} as any)).rejects.toThrow(
        'Product not SOLDOUT',
      );
    });

    it('should return generic error: RpcException', async () => {
      jest
        .spyOn(orderRepository, 'findOneByIdProduct')
        .mockRejectedValue(() => {
          throw new Error();
        });

      await expect(orderService.reversalProduct({} as any)).rejects.toThrow(
        RpcException,
      );
    });
  });

  describe('rollback', () => {
    it('should return product', async () => {
      const idProduct = 'idProduct123';
      const status = StatusProductEnum.AVAILABLE;

      jest.spyOn(orderRepository, 'changeStatus').mockResolvedValue({
        idProduct,
        status,
        price: 1200,
      } as any);
      jest.spyOn(servicePaymentClientProxy, 'emit');

      const result = await orderService.rollback({ idProduct });

      expect(orderRepository.changeStatus).toHaveBeenCalledWith(
        idProduct,
        StatusProductEnum.AVAILABLE,
      );
      expect(inventoryProductClientProxy.emit).toHaveBeenCalledWith(
        'changeStatus-inventory',
        {
          id: idProduct,
          changeStatusDto: StatusProductEnum.AVAILABLE,
        },
      );

      expect(result).toEqual({
        idProduct,
        status,
        price: 1200,
      });
    });

    it('should return error: Product not found', async () => {
      await expect(orderService.rollback({} as any)).rejects.toThrow(
        'Product not found',
      );
    });

    it('should return generic error: RpcException', async () => {
      jest
        .spyOn(orderRepository, 'findOneByIdProduct')
        .mockRejectedValue(() => {
          throw new Error();
        });

      await expect(orderService.rollback({} as any)).rejects.toThrow(
        RpcException,
      );
    });
  });
});
