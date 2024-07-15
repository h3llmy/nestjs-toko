import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderDetails } from './entities/orderDetails.entity';
import { PaymentGatewayService } from './paymentGateway.service';
import { OrderRepository } from './order.repository';
import { OrderDetailsRepository } from './order-details.repository';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderDetails]), ProductsModule],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    PaymentGatewayService,
    OrderRepository,
    OrderDetailsRepository,
  ],
  exports: [OrdersService],
})
export class OrdersModule {}
