import { Module } from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { DiscountsController } from './discounts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discount } from './entities/discount.entity';
import { ProductsModule } from '../products/products.module';
import { DiscountsRepository } from './discounts.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Discount]),
    ProductsModule,
    ProductsModule,
  ],
  controllers: [DiscountsController],
  providers: [DiscountsService, DiscountsRepository],
})
export class DiscountsModule {}
