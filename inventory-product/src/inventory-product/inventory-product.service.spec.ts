import { Test, TestingModule } from '@nestjs/testing';
import { InventoryProductService } from './inventory-product.service';

describe('InventoryProductService', () => {
  let service: InventoryProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InventoryProductService],
    }).compile();

    service = module.get<InventoryProductService>(InventoryProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
