import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderDetails } from './entities/orderDetails.entity';
import { PaymentGatewayService } from './paymentGateway.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderDetails])],
  controllers: [OrdersController],
  providers: [OrdersService, PaymentGatewayService],
  exports: [OrdersService],
})
export class OrdersModule {}
