import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleConfig } from '@app/common/config/typeOrmModule.config';
import { User } from '../domains/users/entities/user.entity';
import { Role } from '../domains/roles/entities/role.entity';
import { Product } from '../domains/products/entities/product.entity';
import { ProductCategory } from '../domains/product-category/entities/product-category.entity';
import { Permissions } from '../domains/permissions/entities/permission.entity';
import { Order } from '../domains/orders/entities/order.entity';
import { OrderDetails } from '../domains/orders/entities/orderDetails.entity';
import { Inventory } from '../domains/inventories/entities/inventory.entity';
import { Discount } from '../domains/discounts/entities/discount.entity';

// TODO: make it auto load entity
@Module({
  imports: [
    TypeOrmModule.forRootAsync(typeOrmModuleConfig),
    TypeOrmModule.forFeature([
      User,
      Role,
      Product,
      ProductCategory,
      Permissions,
      Order,
      OrderDetails,
      Inventory,
      Discount,
    ]),
  ],
  providers: [SeederService],
})
export class SeederModule {}
