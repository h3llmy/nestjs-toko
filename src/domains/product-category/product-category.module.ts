import { Module } from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { ProductCategoryController } from './product-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCategory } from './entities/product-category.entity';
import { ProductCategoryRepository } from './product-category.repository';
import { ProductCategorySubscribers } from './entities/product-category.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([ProductCategory])],
  controllers: [ProductCategoryController],
  providers: [
    ProductCategoryService,
    ProductCategoryRepository,
    ProductCategorySubscribers,
  ],
  exports: [ProductCategoryService],
})
export class ProductCategoryModule {}
