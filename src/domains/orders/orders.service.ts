import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PaymentGatewayService } from './paymentGateway.service';
import { DataSource, In } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { OrderRepository } from './order.repository';
import { User } from '../users/entities/user.entity';
import { OrderDetailsRepository } from './order-details.repository';

@Injectable()
export class OrdersService {
  constructor(
    private readonly paymentGatewayService: PaymentGatewayService,
    private readonly productService: ProductsService,
    private readonly orderRepository: OrderRepository,
    private readonly orderDetailsRepository: OrderDetailsRepository,
    private readonly dataSource: DataSource,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: User) {
    const transaction = this.dataSource.createQueryRunner();
    await transaction.startTransaction();
    try {
      const productFind = await this.productService.findMany({
        where: {
          id: In(createOrderDto.orders.map((item) => item.productId)),
        },
      });

      if (productFind.length !== createOrderDto.orders.length)
        throw new NotFoundException('Product not found');

      // const orderDetails = this.orderDetailsRepository.saveEntity([{

      // }], {
      //   session: transaction,
      // });

      const order = await this.orderRepository.saveEntity(
        {
          user,
        },
        { session: transaction },
      );

      const paymentResponse =
        await this.paymentGatewayService.createTransaction({
          transaction_details: {
            order_id: order.id,
            gross_amount: order.totalAmount,
          },
          item_details: [
            {
              id: 'item-123',
              price: 10000,
              quantity: 1,
              name: 'test',
              category: 'test',
            },
          ],
        });
      await transaction.commitTransaction();
      return paymentResponse;
    } catch (error) {
      await transaction.rollbackTransaction();
      throw error;
    } finally {
      await transaction.release();
    }
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
