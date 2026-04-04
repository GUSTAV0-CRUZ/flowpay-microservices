import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { OrderRepository } from './repository/order.respository';

describe('OrderService', () => {
  let service: OrderService;
  let orderRepository: OrderRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: OrderRepository,
          useValue: {},
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
