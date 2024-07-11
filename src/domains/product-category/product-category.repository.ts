import { InjectRepository } from '@nestjs/typeorm';
import { ProductCategory } from './entities/product-category.entity';
import { Repository } from 'typeorm';
import { DefaultRepository } from '@app/common';

export class ProductCategoryRepository extends DefaultRepository<ProductCategory> {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly productCategoryRepository: Repository<ProductCategory>,
  ) {
    super(
      productCategoryRepository.target,
      productCategoryRepository.manager,
      productCategoryRepository.queryRunner,
    );
  }
}
