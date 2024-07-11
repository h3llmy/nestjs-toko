import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductsRepository } from './products.repository';
import { InventoriesModule } from '../inventories/inventories.module';
import { ProductCategoryModule } from '../product-category/product-category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    InventoriesModule,
    ProductCategoryModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository],
  exports: [ProductsService],
})
export class ProductsModule {}
