import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { OrderRepository } from './repository/order.respository';
import { ClientProxyService } from '../client-proxy/client-proxy.service';

describe('OrderService', () => {
  let service: OrderService;
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
          useValue: {},
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

    service = module.get<OrderService>(OrderService);
    orderRepository = module.get<OrderRepository>(OrderRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
