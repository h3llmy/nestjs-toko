import { ProductsService } from '@domains/products/products.service';
import { DiscountsRepository } from './discounts.repository';
import { DiscountsService } from './discounts.service';
import { TestBed } from '@automock/jest';
import { Discount } from './entities/discount.entity';
import { Product } from '@domains/products/entities/product.entity';
import { Inventory } from '@domains/inventories/entities/inventory.entity';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { In } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { IPaginationResponse } from '@libs/database';
import { PaginationDiscountDto } from './dto/pagination-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';

describe('DiscountsService', () => {
  let discountService: DiscountsService;
  let discountsRepository: jest.Mocked<DiscountsRepository>;
  let productsService: jest.Mocked<ProductsService>;

  const mockInventory: Inventory = {
    id: 'ddeb70d1-034a-412e-bbcc-5a723572383a',
    quantity: 10,
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    price: 10,
    description: 'Test Product',
    deletedAt: null,
    inventory: mockInventory,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockDiscount: Discount = {
    id: '1',
    name: 'Test Discount',
    percentage: 10,
    description: 'Test Discount',
    code: 'TEST_DISCOUNT',
    products: [mockProduct],
    startDate: Date.now(),
    endDate: Date.now(),
    deletedAt: null,
    updatedAt: new Date(),
    createdAt: new Date(),
  };

  const mockDiscountPagination: IPaginationResponse<Discount> = {
    data: [mockDiscount],
    totalData: 1,
    totalPages: 1,
    page: 1,
    limit: 10,
  };

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(DiscountsService).compile();

    discountService = unit;
    discountsRepository = unitRef.get(DiscountsRepository);
    productsService = unitRef.get(ProductsService);
  });

  it('should be defined', () => {
    expect(discountService).toBeDefined();
    expect(discountsRepository).toBeDefined();
    expect(productsService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new discount', async () => {
      const mockCreateDiscount: CreateDiscountDto = {
        code: mockDiscount.code,
        name: mockDiscount.name,
        percentage: mockDiscount.percentage,
        description: mockDiscount.description,
        productId: ['1'],
        startDate: mockDiscount.startDate,
        endDate: mockDiscount.endDate,
      };

      productsService.findMany.mockResolvedValue([mockProduct]);
      discountsRepository.saveEntity.mockResolvedValue(mockDiscount);
      const createdDiscount = await discountService.create(mockCreateDiscount);
      expect(createdDiscount).toEqual(mockDiscount);
      expect(productsService.findMany).toHaveBeenCalledWith({
        where: { id: In(mockCreateDiscount.productId) },
      });
      expect(discountsRepository.saveEntity).toHaveBeenCalledWith({
        code: mockDiscount.code,
        name: mockDiscount.name,
        percentage: mockDiscount.percentage,
        description: mockDiscount.description,
        startDate: mockDiscount.startDate,
        endDate: mockDiscount.endDate,
        products: [mockProduct],
      });
    });
    it('should throw an error if product not found', async () => {
      const mockCreateDiscount: CreateDiscountDto = {
        code: mockDiscount.code,
        name: mockDiscount.name,
        percentage: mockDiscount.percentage,
        description: mockDiscount.description,
        productId: ['1'],
        startDate: mockDiscount.startDate,
        endDate: mockDiscount.endDate,
      };

      productsService.findMany.mockResolvedValue([]);
      discountsRepository.saveEntity.mockResolvedValue(mockDiscount);
      await expect(discountService.create(mockCreateDiscount)).rejects.toThrow(
        NotFoundException,
      );
      expect(productsService.findMany).toHaveBeenCalledWith({
        where: { id: In(mockCreateDiscount.productId) },
      });
      expect(discountsRepository.saveEntity).not.toHaveBeenCalled();
    });
  });

  describe('findAllPaginate', () => {
    it('should get list discounts', async () => {
      const paginationOption: PaginationDiscountDto = {
        page: 1,
        limit: 10,
      };
      discountsRepository.findPagination.mockResolvedValue(
        mockDiscountPagination,
      );

      const discounts = await discountService.findAllPaginate(paginationOption);
      expect(discounts).toEqual(mockDiscountPagination);
      expect(discountsRepository.findPagination).toHaveBeenCalledWith({
        ...paginationOption,
        relations: {
          products: {
            category: true,
            inventory: true,
          },
        },
      });
    });
  });

  describe('findOne', () => {
    it('should get discount by id', async () => {
      discountsRepository.findOne.mockResolvedValue(mockDiscount);
      const discount = await discountService.findOne(mockDiscount.id);
      expect(discountsRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockDiscount.id },
      });
      expect(discount).toEqual(mockDiscount);
    });
  });

  describe('update', () => {
    it('should update a discount', async () => {
      const mockUpdateDiscount: UpdateDiscountDto = {
        code: mockDiscount.code,
        name: mockDiscount.name,
        percentage: mockDiscount.percentage,
        description: mockDiscount.description,
        productId: ['1'],
        startDate: mockDiscount.startDate,
        endDate: mockDiscount.endDate,
      };

      productsService.findMany.mockResolvedValue([mockProduct]);
      discountsRepository.saveEntity.mockResolvedValue(mockDiscount);
      const updatedDiscount = await discountService.update(
        mockDiscount.id,
        mockUpdateDiscount,
      );
      expect(updatedDiscount).toEqual(mockDiscount);
      expect(productsService.findMany).toHaveBeenCalledWith({
        where: { id: In(mockUpdateDiscount.productId) },
      });
      expect(discountsRepository.saveEntity).toHaveBeenCalledWith({
        id: mockDiscount.id,
        code: mockDiscount.code,
        name: mockDiscount.name,
        percentage: mockDiscount.percentage,
        description: mockDiscount.description,
        startDate: mockDiscount.startDate,
        endDate: mockDiscount.endDate,
        products: [mockProduct],
      });
    });

    it('should throw an error if product not found', async () => {
      const mockUpdateDiscount: UpdateDiscountDto = {
        code: mockDiscount.code,
        name: mockDiscount.name,
        percentage: mockDiscount.percentage,
        description: mockDiscount.description,
        productId: ['1'],
        startDate: mockDiscount.startDate,
        endDate: mockDiscount.endDate,
      };
      productsService.findMany.mockResolvedValue([]);
      discountsRepository.saveEntity.mockResolvedValue(mockDiscount);
      await expect(
        discountService.update(mockDiscount.id, mockUpdateDiscount),
      ).rejects.toThrow(NotFoundException);
      expect(productsService.findMany).toHaveBeenCalledWith({
        where: { id: In(mockUpdateDiscount.productId) },
      });
      expect(discountsRepository.saveEntity).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a discount', async () => {
      discountsRepository.softDelete.mockResolvedValue({
        affected: 1,
        raw: mockDiscount,
        generatedMaps: [],
      });
      const deletedDiscount = await discountService.remove(mockDiscount.id);
      expect(deletedDiscount).toEqual({
        affected: 1,
        raw: mockDiscount,
        generatedMaps: [],
      });
      expect(discountsRepository.softDelete).toHaveBeenCalledWith(
        mockDiscount.id,
      );
    });
  });
});
