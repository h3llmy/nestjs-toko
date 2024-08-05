import { TestBed } from '@automock/jest';
import { ProductCategoryController } from './product-category.controller';
import { ProductCategoryService } from './product-category.service';
import { ProductCategory } from './entities/product-category.entity';
import { IPaginationResponse } from '@libs/database';
import { PaginationProductCategoryDto } from './dto/pagination-product-category.dto';
import { NotFoundException } from '@nestjs/common';

describe('ProductCategoryController', () => {
  let productCategoryController: ProductCategoryController;
  let productCategoryService: jest.Mocked<ProductCategoryService>;

  const mockProductCategory: ProductCategory = {
    id: '1',
    name: 'test',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockProductCategoryPagination: IPaginationResponse<ProductCategory> = {
    totalData: 1,
    totalPages: 1,
    page: 1,
    limit: 10,
    data: [mockProductCategory],
  };

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(
      ProductCategoryController,
    ).compile();

    productCategoryController = unit;
    productCategoryService = unitRef.get(ProductCategoryService);
  });

  it('should be defined', () => {
    expect(productCategoryController).toBeDefined();
    expect(productCategoryService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new product category', async () => {
      productCategoryService.create.mockResolvedValue(mockProductCategory);
      const productCategory = await productCategoryController.create({
        name: 'test',
      });
      expect(productCategory).toEqual(mockProductCategory);
      expect(productCategoryService.create).toHaveBeenCalledWith({
        name: 'test',
      });
    });
  });

  describe('findAllAndPaginate', () => {
    it('should find all product categories', async () => {
      productCategoryService.findAllAndPaginate.mockResolvedValue(
        mockProductCategoryPagination,
      );
      const paginationOption: PaginationProductCategoryDto = {
        page: 1,
        limit: 10,
      };
      const pagination =
        await productCategoryController.findAllAndPaginate(paginationOption);
      expect(pagination).toEqual(mockProductCategoryPagination);
      expect(productCategoryService.findAllAndPaginate).toHaveBeenCalledWith(
        paginationOption,
      );
    });
  });

  describe('findOne', () => {
    it('should find one product category', async () => {
      productCategoryService.findOne.mockResolvedValue(mockProductCategory);
      const productCategory = await productCategoryController.findOne('1');
      expect(productCategory).toEqual(mockProductCategory);
      expect(productCategoryService.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw error if product category not found', async () => {
      productCategoryService.findOne.mockResolvedValue(null);
      expect(productCategoryController.findOne('1')).rejects.toThrow(
        NotFoundException,
      );
      expect(productCategoryService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a product category', async () => {
      productCategoryService.update.mockResolvedValue(mockProductCategory);
      const productCategory = await productCategoryController.update(
        '1',
        mockProductCategory,
      );
      expect(productCategory).toEqual(mockProductCategory);
      expect(productCategoryService.update).toHaveBeenCalledWith(
        '1',
        mockProductCategory,
      );
    });

    it('should throw error if product category not found', async () => {
      productCategoryService.update.mockResolvedValue(null);
      expect(
        productCategoryController.update('1', mockProductCategory),
      ).rejects.toThrow(NotFoundException);
      expect(productCategoryService.update).toHaveBeenCalledWith(
        '1',
        mockProductCategory,
      );
    });
  });

  describe('remove', () => {
    it('should remove a product category', async () => {
      productCategoryService.remove.mockResolvedValue({
        generatedMaps: [],
        raw: null,
        affected: 1,
      });
      const productCategory = await productCategoryController.remove('1');
      expect(productCategory).toBeDefined();
      expect(productCategoryService.remove).toHaveBeenCalledWith('1');
    });

    it('should throw error if product category not found', async () => {
      productCategoryService.remove.mockResolvedValue(null);
      expect(productCategoryController.remove('1')).rejects.toThrow(
        NotFoundException,
      );
      expect(productCategoryService.remove).toHaveBeenCalledWith('1');
    });
  });
});
