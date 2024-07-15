import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PaymentGatewayService } from './paymentGateway.service';
import { DataSource } from 'typeorm';

@Injectable()
export class OrdersService {
  constructor(
    private readonly paymentGatewayService: PaymentGatewayService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const transaction = this.dataSource.createQueryRunner();
    await transaction.startTransaction();
    try {
      const order = await this.paymentGatewayService.createTransaction({
        transaction_details: {
          order_id: `order-${Date.now()}`,
          gross_amount: 10000,
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
      return order;
      await transaction.commitTransaction();
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
