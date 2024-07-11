import { TestBed } from '@automock/jest';
import { ProductCategoryService } from './product-category.service';
import { ProductCategoryRepository } from './product-category.repository';

describe('ProductCategoryService', () => {
  let productCategoryService: ProductCategoryService;
  let productCategoryRepository: jest.Mocked<ProductCategoryRepository>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(ProductCategoryService).compile();

    productCategoryService = unit;
    productCategoryRepository = unitRef.get(ProductCategoryRepository);
  });

  it('should be defined', () => {
    expect(productCategoryService).toBeDefined();
    expect(productCategoryRepository).toBeDefined();
  });
});
