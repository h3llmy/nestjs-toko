import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductsRepository } from './products.repository';
import { InventoriesModule } from '@domains/inventories/inventories.module';
import { ProductCategoryModule } from '@domains/product-category/product-category.module';
import { ProductImages } from './entities/product-images.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductImages]),
    InventoriesModule,
    ProductCategoryModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository],
  exports: [ProductsService],
})
export class ProductsModule {}
