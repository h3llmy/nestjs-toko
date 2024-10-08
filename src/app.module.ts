import { Module } from '@nestjs/common';
import { CommonModule } from '@libs/common';
import { UsersModule } from '@domains/users/users.module';
import { AuthModule } from '@domains/auth/auth.module';
import { ProductsModule } from '@domains/products/products.module';
import { InventoriesModule } from '@domains/inventories/inventories.module';
import { ProductCategoryModule } from '@domains/product-category/product-category.module';
import { DiscountsModule } from '@domains/discounts/discounts.module';
import { OrdersModule } from '@domains/orders/orders.module';
import { RolesModule } from '@domains/roles/roles.module';
import { PermissionsModule } from '@domains/permissions/permissions.module';
import { DatabaseModule } from '@libs/database';
import { ReportModule } from '@domains/report/report.module';
import { PostageModule } from './domains/postage/postage.module';

@Module({
  imports: [
    CommonModule,
    DatabaseModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    ProductCategoryModule,
    InventoriesModule,
    DiscountsModule,
    OrdersModule,
    RolesModule,
    PermissionsModule,
    ReportModule,
    PostageModule,
  ],
})
export class AppModule {}
