import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, DeepPartial, In, QueryRunner } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { OrderRepository } from './order.repository';
import { User } from '../users/entities/user.entity';
import { OrderDetailsRepository } from './order-details.repository';
import { OrderDetails } from './entities/orderDetails.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import {
  PaymentCheckDto,
  PaymentGatewayService,
  PaymentItemDetails,
} from '@app/payment-gateway';
import { Order, OrderStatus } from './entities/order.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    private readonly paymentGatewayService: PaymentGatewayService,
    private readonly productService: ProductsService,
    private readonly orderRepository: OrderRepository,
    private readonly orderDetailsRepository: OrderDetailsRepository,
    private readonly dataSource: DataSource,
  ) {}

  private async increaseInventory(order: Order, transaction: QueryRunner) {
    const productList: Product[] = order.orderDetails.map((orderDetail) => {
      const updatedProduct = orderDetail.product;
      updatedProduct.inventory.quantity += orderDetail.quantity;
      return updatedProduct;
    });
    this.productService.save(productList, {
      session: transaction,
    });
  }

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

      const productMap = new Map(
        products.map((product) => [product.id, product]),
      );

      const orderItems: DeepPartial<OrderDetails>[] = createOrderDto.orders.map(
        (order) => {
          const product = productMap.get(order.productId);
          if (!product) {
            throw new NotFoundException(
              `Product with id ${order.productId} not found`,
            );
          }

          let totalPrice = product.price * order.quantity;

          if (order.discountId) {
            const discount = product.discounts.find(
              (d) => d.id === order.discountId,
            );
            if (!discount) {
              throw new NotFoundException(
                `Discount with id ${order.discountId} not found`,
              );
            }

            const currentDate = Date.now() / 1000;
            if (
              discount.startDate > currentDate ||
              discount.endDate < currentDate
            ) {
              throw new NotFoundException(
                `Discount ${discount.name} is not valid`,
              );
            }

            const discountPercentage = discount.percentage / 100;
            totalPrice *= 1 - discountPercentage;
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

      const productsToUpdate = orderItems.map((item) => item.product);
      await this.productService.save(productsToUpdate, {
        session: transaction,
      });

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

      const itemsDetail: PaymentItemDetails[] = savedOrder.orderDetails.map(
        (orderDetail: DeepPartial<OrderDetails>) => ({
          id: orderDetail.id,
          category: orderDetail.categoryName,
          name: orderDetail.productName,
          price: orderDetail.totalPrice / orderDetail.quantity,
          quantity: orderDetail.quantity,
        }),
      );

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

  async notification(payload: PaymentCheckDto) {
    const paymentStatus =
      await this.paymentGatewayService.paymentCheck(payload);

    const transaction = this.dataSource.createQueryRunner();
    await transaction.startTransaction();

    const order = await this.orderRepository.findOne({
      where: { id: paymentStatus.order_id },
      relations: {
        orderDetails: {
          product: true,
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    let orderStatus: OrderStatus;

    try {
      switch (paymentStatus.transaction_status) {
        // Success
        case 'capture':
        case 'settlement':
          orderStatus = OrderStatus.PAID;
          break;

        // Failure
        case 'deny':
        case 'cancel':
        case 'expire':
        case 'failure':
          orderStatus = OrderStatus.FAILED;
          await this.increaseInventory(order, transaction);
          break;

        // Pending
        case 'pending':
          orderStatus = OrderStatus.PENDING;
          break;

        // Refund
        case 'refund':
        case 'partial_refund':
        case 'chargeback':
        case 'partial_chargeback':
          orderStatus = OrderStatus.REFUND;
          await this.increaseInventory(order, transaction);
          break;

        default:
          throw new Error('Invalid transaction status');
      }
      await this.orderRepository.updateEntity(
        { id: paymentStatus.order_id },
        { status: orderStatus },
        { session: transaction },
      );
      await transaction.commitTransaction();
    } catch (error) {
      await transaction.rollbackTransaction();
      throw error;
    } finally {
      await transaction.release();
    }
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
