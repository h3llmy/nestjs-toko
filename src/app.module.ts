import { Module } from '@nestjs/common';
import { CommonModule } from '@app/common';
import { UsersModule } from './domains/users/users.module';
import { AuthModule } from './domains/auth/auth.module';
import { ProductsModule } from './domains/products/products.module';
import { InventoriesModule } from './domains/inventories/inventories.module';
import { ProductCategoryModule } from './domains/product-category/product-category.module';

@Module({
  imports: [
    CommonModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    ProductCategoryModule,
    InventoriesModule,
  ],
})
export class AppModule {}
