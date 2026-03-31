import { Test, TestingModule } from '@nestjs/testing';
import { InventoryProductService } from './inventory-product.service';
import { ProductRepository } from './repository/product.repository';

describe('InventoryProductService', () => {
  let service: InventoryProductService;
  let productRepository: ProductRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryProductService,
        {
          provide: ProductRepository,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<InventoryProductService>(InventoryProductService);
    productRepository = module.get<ProductRepository>(ProductRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
