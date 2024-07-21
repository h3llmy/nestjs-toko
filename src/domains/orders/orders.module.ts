import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderDetails } from './entities/orderDetails.entity';
import { OrderRepository } from './order.repository';
import { OrderDetailsRepository } from './order-details.repository';
import { ProductsModule } from '../products/products.module';
import {
  PaymentGatewayModule,
  paymentGatewayConfig,
} from '@app/payment-gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderDetails]),
    ProductsModule,
    PaymentGatewayModule.forRootAsync(paymentGatewayConfig),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderRepository, OrderDetailsRepository],
  exports: [OrdersService],
})
export class OrdersModule {}
