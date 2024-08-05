import { TestBed } from '@automock/jest';
import { ProductCategoryService } from './product-category.service';
import { ProductCategoryRepository } from './product-category.repository';
import { ProductCategory } from './entities/product-category.entity';
import { IPaginationResponse } from '@libs/database';
import { PaginationProductCategoryDto } from './dto/pagination-product-category.dto';

describe('ProductCategoryService', () => {
  let productCategoryService: ProductCategoryService;
  let productCategoryRepository: jest.Mocked<ProductCategoryRepository>;

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
    const { unit, unitRef } = TestBed.create(ProductCategoryService).compile();

    productCategoryService = unit;
    productCategoryRepository = unitRef.get(ProductCategoryRepository);
  });

  it('should be defined', () => {
    expect(productCategoryService).toBeDefined();
    expect(productCategoryRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new product category', async () => {
      productCategoryRepository.saveEntity.mockResolvedValue(
        mockProductCategory,
      );
      const productCategory = await productCategoryService.create({
        name: 'test',
      });
      expect(productCategory).toEqual(mockProductCategory);
      expect(productCategoryRepository.saveEntity).toHaveBeenCalledWith({
        name: 'test',
      });
    });
  });

  describe('findAllAndPaginate', () => {
    it('should find all product categories', async () => {
      productCategoryRepository.findPagination.mockResolvedValue(
        mockProductCategoryPagination,
      );
      const paginationOption: PaginationProductCategoryDto = {
        page: 1,
        limit: 10,
      };
      const productCategories =
        await productCategoryService.findAllAndPaginate(paginationOption);
      expect(productCategories).toEqual(mockProductCategoryPagination);
      expect(productCategoryRepository.findPagination).toHaveBeenCalledWith(
        paginationOption,
      );
    });
  });

  describe('findOne', () => {
    it('should find a product category by id', async () => {
      productCategoryRepository.findOne.mockResolvedValue(mockProductCategory);
      const productCategory = await productCategoryService.findOne('1');
      expect(productCategory).toEqual(mockProductCategory);
      expect(productCategoryRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  describe('update', () => {
    it('should update a product category', async () => {
      productCategoryRepository.updateAndFind.mockResolvedValue(
        mockProductCategory,
      );
      const productCategory = await productCategoryService.update('1', {
        name: 'test',
      });
      expect(productCategory).toEqual(mockProductCategory);
      expect(productCategoryRepository.updateAndFind).toHaveBeenCalledWith(
        { id: '1' },
        {
          name: 'test',
        },
      );
    });
  });

  describe('remove', () => {
    it('should delete a product category', async () => {
      const deletedValue = {
        raw: null,
        affected: 1,
        generatedMaps: [],
      };
      productCategoryRepository.softDelete.mockResolvedValue(deletedValue);
      const productCategory = await productCategoryService.remove('1');
      expect(productCategory).toEqual(deletedValue);
      expect(productCategoryRepository.softDelete).toHaveBeenCalledWith({
        id: '1',
      });
    });
  });
});
