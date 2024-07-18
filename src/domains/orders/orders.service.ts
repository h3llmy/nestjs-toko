import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, DeepPartial, In } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { OrderRepository } from './order.repository';
import { User } from '../users/entities/user.entity';
import { OrderDetailsRepository } from './order-details.repository';
import { OrderDetails } from './entities/orderDetails.entity';
import { InventoriesService } from '../inventories/inventories.service';
import { CreateOrderDto } from './dto/create-order.dto';
import {
  PaymentCheckDto,
  PaymentGatewayService,
  PaymentItemDetails,
} from '@app/payment-gateway';

@Injectable()
export class OrdersService {
  constructor(
    private readonly paymentGatewayService: PaymentGatewayService,
    private readonly productService: ProductsService,
    private readonly inventoriesService: InventoriesService,
    private readonly orderRepository: OrderRepository,
    private readonly orderDetailsRepository: OrderDetailsRepository,
    private readonly dataSource: DataSource,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: User) {
    const transaction = this.dataSource.createQueryRunner();
    await transaction.startTransaction();
    try {
      const productIds = createOrderDto.orders.map((item) => item.productId);
      const products = await this.productService.findMany({
        where: { id: In(productIds) },
        relations: { category: true, discounts: true, inventory: true },
      });

      if (products.length !== productIds.length) {
        throw new NotFoundException('Some products were not found');
      }

      const orderItems: DeepPartial<OrderDetails>[] = createOrderDto.orders.map(
        (order) => {
          const product = products.find((p) => p.id === order.productId);
          if (!product) {
            throw new NotFoundException(
              `Product with id ${order.productId} not found`,
            );
          }
          let totalPrice: number;

          if (order.discountId) {
            const discount = product.discounts.find(
              (d) => d.id === order.discountId,
            );
            if (!discount) {
              throw new NotFoundException(
                `Discount with id ${order.discountId} not found`,
              );
            }

            const discountPercentage = discount.percentage / 100;

            totalPrice =
              product.price * order.quantity * (1 - discountPercentage);
          } else {
            totalPrice = product.price * order.quantity;
          }

          if (product.inventory.quantity < order.quantity) {
            throw new NotFoundException('Not enough product in stock');
          }
          product.inventory.quantity -= order.quantity;

          return {
            product,
            productName: product.name,
            productDescription: product.description,
            productPrice: product.price,
            category: product.category,
            categoryName: product.category.name,
            quantity: order.quantity,
            totalPrice,
          };
        },
      );

      await Promise.all(
        orderItems.map((order) => {
          return this.productService.save(order.product, {
            session: transaction,
          });
        }),
      );

      const savedOrderItems = (await this.orderDetailsRepository.createEntity(
        orderItems,
        { session: transaction },
      )) as OrderDetails[];

      const totalAmount = savedOrderItems.reduce(
        (prev, curr) => prev + curr.totalPrice,
        0,
      );

      const savedOrder = await this.orderRepository.createEntity(
        {
          orderDetails: savedOrderItems,
          user,
          totalAmount,
        },
        { session: transaction },
      );

      const itemsDetail: PaymentItemDetails[] = (
        savedOrder.orderDetails as OrderDetails[]
      ).map((orderDetail) => {
        return {
          id: orderDetail.id,
          category: orderDetail.categoryName,
          name: orderDetail.productName,
          price: orderDetail.product.price,
          quantity: orderDetail.quantity,
        };
      });

      console.log({
        transaction_details: {
          order_id: savedOrder.id,
          gross_amount: savedOrder.totalAmount,
        },
        item_details: itemsDetail,
      });

      const paymentResponse =
        await this.paymentGatewayService.createTransaction({
          transaction_details: {
            order_id: savedOrder.id,
            gross_amount: savedOrder.totalAmount,
          },
          item_details: itemsDetail,
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

  notification(payload: PaymentCheckDto) {
    return this.paymentGatewayService.paymentCheck(payload);
  }

  findAll() {
    return this.orderRepository.findPagination({});
  }

  findOne(id: string) {
    return this.orderRepository.findOne({
      where: { id },
      relations: {
        orderDetails: true,
      },
    });
  }

  remove(id: string) {
    return this.orderRepository.softDelete(id);
  }
}
