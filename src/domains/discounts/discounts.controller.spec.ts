import { TestBed } from '@automock/jest';
import { DiscountsController } from './discounts.controller';
import { DiscountsService } from './discounts.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { Discount } from './entities/discount.entity';
import { IPaginationResponse } from '@libs/database';
import { Product } from '@domains/products/entities/product.entity';
import { NotFoundException } from '@nestjs/common';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { UpdateResult } from 'typeorm';

describe('DiscountsController', () => {
  let discountController: DiscountsController;
  let discountService: jest.Mocked<DiscountsService>;

  const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    price: 10,
    description: 'Test Product',
    deletedAt: null,
    updatedAt: new Date(),
    createdAt: new Date(),
  };

  const mockDiscount: Discount = {
    id: '1',
    code: 'test',
    description: 'test',
    name: 'test',
    percentage: 10,
    products: [mockProduct],
    startDate: 1,
    endDate: 1,
    deletedAt: null,
    updatedAt: new Date(),
    createdAt: new Date(),
  };

  const mockDiscountPagination: IPaginationResponse<Discount> = {
    totalData: 1,
    totalPages: 1,
    page: 1,
    limit: 10,
    data: [mockDiscount],
  };

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(DiscountsController).compile();

    discountController = unit;
    discountService = unitRef.get(DiscountsService);
  });

  it('should be defined', () => {
    expect(discountController).toBeDefined();
    expect(discountService).toBeDefined();
  });

  describe('create', () => {
    it('should be defined', () => {
      expect(discountController.create).toBeDefined();
    });

    it('should create discount', async () => {
      const createDiscountDto: CreateDiscountDto = {
        code: 'test',
        description: 'test',
        name: 'test',
        percentage: 10,
        productId: ['1'],
        startDate: 1,
        endDate: 1,
      };
      discountService.create.mockResolvedValue(createDiscountDto);
      expect(await discountController.create(createDiscountDto)).toEqual(
        createDiscountDto,
      );
    });
  });

  describe('findAll', () => {
    it('should be defined', () => {
      expect(discountController.findAllPaginate).toBeDefined();
    });
    it('should get list products with pagination', async () => {
      const paginationOption = {
        page: 1,
        limit: 10,
      };
      discountService.findAllPaginate.mockResolvedValue(mockDiscountPagination);
      const discounts =
        await discountController.findAllPaginate(paginationOption);
      expect(discounts).toEqual(mockDiscountPagination);
      expect(discountService.findAllPaginate).toHaveBeenCalledWith(
        paginationOption,
      );
    });
  });

  describe('findOne', () => {
    it('should be defined', () => {
      expect(discountController.findOne).toBeDefined();
    });
    it('should get discount by id', async () => {
      discountService.findOne.mockResolvedValue(mockDiscount);
      const discount = await discountController.findOne(mockDiscount.id);
      expect(discount).toEqual(mockDiscount);
      expect(discountService.findOne).toHaveBeenCalledWith(mockDiscount.id);
    });

    it('should throw NotFoundException if discount not found', async () => {
      discountService.findOne.mockResolvedValue(null);
      await expect(discountController.findOne('1')).rejects.toThrow(
        NotFoundException,
      );
      expect(discountService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should be defined', () => {
      expect(discountController.update).toBeDefined();
    });

    it('should update discount', async () => {
      const updateDiscountDto: UpdateDiscountDto = {
        code: 'test',
        description: 'test',
        name: 'test',
        percentage: 10,
        productId: ['1'],
        startDate: 1,
        endDate: 1,
      };
      discountService.update.mockResolvedValue(updateDiscountDto);
      expect(await discountController.update('1', updateDiscountDto)).toEqual(
        updateDiscountDto,
      );
      expect(discountService.update).toHaveBeenCalledWith(
        '1',
        updateDiscountDto,
      );
    });
  });

  describe('remove', () => {
    it('should be defined', () => {
      expect(discountController.remove).toBeDefined();
    });
    it('should remove discount', async () => {
      const mockRemoveDiscount: UpdateResult = {
        raw: [],
        affected: 1,
        generatedMaps: [],
      };
      discountService.remove.mockResolvedValue(mockRemoveDiscount);
      const discount = await discountController.remove(mockDiscount.id);
      expect(discount.message).toBeDefined();
      expect(discountService.remove).toHaveBeenCalledWith(mockDiscount.id);
    });
    it('should throw NotFoundException if discount not found', async () => {
      const mockRemoveDiscount: UpdateResult = {
        raw: [],
        affected: 0,
        generatedMaps: [],
      };
      discountService.remove.mockResolvedValue(mockRemoveDiscount);
      await expect(discountController.remove('1')).rejects.toThrow(
        NotFoundException,
      );
      expect(discountService.remove).toHaveBeenCalledWith('1');
    });
  });
});
