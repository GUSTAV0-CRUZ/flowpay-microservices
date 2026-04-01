/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { InventoryProductService } from './inventory-product.service';
import { ProductRepository } from './repository/product.repository';
import { StatusProductEnum } from './enums/status-product.enum';
import { RpcException } from '@nestjs/microservices';

const createProduct = () => ({
  name: 'anyName',
  status: StatusProductEnum.AVAILABLE,
});

describe('InventoryProductService', () => {
  let inventoryProductService: InventoryProductService;
  let productRepository: ProductRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryProductService,
        {
          provide: ProductRepository,
          useValue: {
            findAll: jest.fn(),
            findOneById: jest.fn(),
          },
        },
      ],
    }).compile();

    inventoryProductService = module.get<InventoryProductService>(
      InventoryProductService,
    );
    productRepository = module.get<ProductRepository>(ProductRepository);
  });

  it('should be defined', () => {
    expect(inventoryProductService).toBeDefined();
  });

  describe('findAll', () => {
    it('shold return array of product', async () => {
      const product = createProduct();

      jest
        .spyOn(productRepository, 'findAll')
        .mockResolvedValue([product] as any);

      const result = await inventoryProductService.findAll();

      expect(productRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([product]);
    });

    it('shold return generic error', async () => {
      jest.spyOn(productRepository, 'findAll').mockRejectedValue(new Error());

      await expect(inventoryProductService.findAll()).rejects.toThrow(
        RpcException,
      );
    });
  });

  describe('findOne', () => {
    it('shold return one product', async () => {
      const product = createProduct();
      const id = 'id123';

      jest
        .spyOn(productRepository, 'findOneById')
        .mockResolvedValue(product as any);

      const result = await inventoryProductService.findOne(id);

      expect(productRepository.findOneById).toHaveBeenCalledTimes(1);
      expect(productRepository.findOneById).toHaveBeenCalledWith(id);
      expect(result).toEqual(product);
    });

    it('shold return error "product not found"', async () => {
      jest
        .spyOn(productRepository, 'findOneById')
        .mockResolvedValue(undefined as any);

      await expect(inventoryProductService.findOne('id123')).rejects.toThrow(
        'product not found',
      );
    });

    it('shold return error "Type of id invalid"', async () => {
      const error = new Error();
      error['path'] = '_id';

      jest
        .spyOn(productRepository, 'findOneById')
        .mockImplementationOnce(() => {
          throw error;
        });

      await expect(inventoryProductService.findOne('id123')).rejects.toThrow(
        'Type of id invalid',
      );
    });

    it('shold return generic error', async () => {
      jest
        .spyOn(productRepository, 'findOneById')
        .mockRejectedValue(new Error());

      await expect(inventoryProductService.findOne('id123')).rejects.toThrow(
        RpcException,
      );
    });
  });
});
