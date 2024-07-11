import { TestBed } from '@automock/jest';
import { ProductCategoryController } from './product-category.controller';
import { ProductCategoryService } from './product-category.service';

describe('ProductCategoryController', () => {
  let productCategoryController: ProductCategoryController;
  let productCategoryService: jest.Mocked<ProductCategoryService>;

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
});
