import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  DataSource,
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  ILike,
  QueryRunner,
} from 'typeorm';
import { ProductsService } from '@domains/products/products.service';
import { OrderRepository } from './order.repository';
import { User } from '@domains/users/entities/user.entity';
import { OrderDetailsRepository } from './order-details.repository';
import { OrderDetails } from './entities/orderDetails.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import {
  PaymentCheckDto,
  PaymentGatewayService,
  PaymentOrderResponseDto,
  TransactionStatus,
} from '@libs/payment-gateway';
import { Order, OrderStatus } from './entities/order.entity';
import { Product } from '@domains/products/entities/product.entity';
import { PaginationOrderDto } from './dto/pagination-order.dto';
import { IPaginationPayload, IPaginationResponse } from '@libs/database';
import { ReadStream } from 'typeorm/platform/PlatformTools';

@Injectable()
export class OrdersService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly orderDetailsRepository: OrderDetailsRepository,
    private readonly paymentGatewayService: PaymentGatewayService,
    private readonly productService: ProductsService,
    private readonly dataSource: DataSource,
  ) {}

  // TODO: add test cases
  findReadableStream(): Promise<ReadStream> {
    const tableName = this.orderRepository.getTableName();
    return this.dataSource
      .getRepository(Order)
      .createQueryBuilder(tableName)
      .leftJoinAndSelect(`${tableName}.orderDetails`, 'orderDetails')
      .leftJoinAndSelect(`${tableName}.user`, 'user')
      .stream();
  }

  /**
   * Increases the inventory quantity for each product in the given order.
   *
   * @param {Order} order - The order containing the order details.
   * @param {QueryRunner} transaction - The transaction to be used for the database operation.
   * @return {Promise<void>} A promise that resolves when the inventory is successfully updated.
   */
  async increaseInventory(
    order: Order,
    transaction: QueryRunner,
  ): Promise<void> {
    const productList: Product[] = order.orderDetails.map((orderDetail) => {
      const updatedProduct = orderDetail.product;
      updatedProduct.inventory.quantity += orderDetail.quantity;
      return updatedProduct;
    });
    this.productService.save(productList, {
      session: transaction,
    });
  }

  /**
   * Creates an order for a user based on the provided order details.
   *
   * @param {CreateOrderDto} createOrderDto - The order details to create the order from.
   * @param {User} user - The user creating the order.
   * @return {Promise<PaymentOrderResponseDto>} The payment response from the payment gateway.
   * @throws {NotFoundException} If some products were not found.
   * @throws {NotFoundException} If a product with the given ID was not found.
   * @throws {NotFoundException} If a discount with the given ID was not found.
   * @throws {NotFoundException} If the discount is not valid.
   * @throws {NotFoundException} If there is not enough product in stock.
   */
  async create(
    createOrderDto: CreateOrderDto,
    user: User,
  ): Promise<PaymentOrderResponseDto & DeepPartial<Order>> {
    const transaction = this.dataSource.createQueryRunner();
    await transaction.startTransaction();

    try {
      const products = await this.productService.getProductWithDiscounts(
        createOrderDto.orders,
      );

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

          const { quantity } = order;
          const { price, inventory, discounts } = product;

          let totalPrice = price * quantity;
          let discountDetail: Partial<OrderDetails> = {};

          if (discounts.length === 0 && order.discountId) {
            throw new NotFoundException(
              `Discount with id ${order.discountId} not found`,
            );
          }

          if (discounts.length > 0) {
            const discount = discounts[0];

            const currentDate = Math.round(Date.now() / 1000);

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
            discountDetail = {
              discount,
              discountName: discount.name,
              discountDescription: discount.description,
              discountCode: discount.code,
              discountPercentage: discount.percentage,
              discountStartDate: discount.startDate,
              discountEndDate: discount.endDate,
            };
          }

          if (inventory.quantity < quantity) {
            throw new BadRequestException(
              `product ${product.name} out of stock`,
            );
          }

          inventory.quantity -= quantity;

          return {
            product,
            productName: product.name,
            productDescription: product.description,
            productPrice: product.price,
            category: product.category,
            categoryName: product.category.name,
            quantity,
            totalPrice,
            ...discountDetail,
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

      const itemsDetail = savedOrder.orderDetails.map(
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

      return { ...paymentResponse, ...savedOrder };
    } catch (error) {
      await transaction.rollbackTransaction();
      throw error;
    } finally {
      await transaction.release();
    }
  }

  /**
   * A function that handles notifications based on the payment status.
   *
   * @param {PaymentCheckDto} payload - The payment payload to process
   * @return {Promise<void>} A promise that resolves when the notification process is completed
   */
  async notification(payload: PaymentCheckDto): Promise<void> {
    const paymentStatus: PaymentCheckDto =
      await this.paymentGatewayService.paymentCheck(payload);

    const transaction = this.dataSource.createQueryRunner();
    await transaction.startTransaction();

    try {
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

      switch (paymentStatus.transaction_status) {
        // Success
        case TransactionStatus.CAPTURE:
        case TransactionStatus.SETTLEMENT:
          orderStatus = OrderStatus.PAID;
          break;

        // Failure
        case TransactionStatus.DENY:
        case TransactionStatus.CANCEL:
        case TransactionStatus.EXPIRE:
        case TransactionStatus.FAILURE:
          orderStatus = OrderStatus.FAILED;
          await this.increaseInventory(order, transaction);
          break;

        // Pending
        case TransactionStatus.PENDING:
          orderStatus = OrderStatus.PENDING;
          break;

        // Refund
        case TransactionStatus.REFUND:
        case TransactionStatus.PARTIAL_REFUND:
        case TransactionStatus.CHARGEBACK:
        case TransactionStatus.PARTIAL_CHARGEBACK:
          orderStatus = OrderStatus.REFUND;
          await this.increaseInventory(order, transaction);
          break;

        default:
          throw new BadRequestException('Invalid transaction status');
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

  /**
   * Finds paginated orders based on the given query and user.
   *
   * @param {PaginationOrderDto} findQuery - The query parameters for pagination.
   * @param {User} user - The user object.
   * @return {Promise<IPaginationResponse<Order>>} A promise that resolves to the paginated response containing the orders.
   */
  findPagination(
    findQuery: PaginationOrderDto,
    user: User,
  ): Promise<IPaginationResponse<Order>> {
    const { search, status, ...paginationQuery } = findQuery;
    const query: IPaginationPayload<Order> = {
      ...paginationQuery,
    };
    query.where = [];
    if (user.role.name === 'user') {
      query.where.push({
        user: {
          id: user.id,
        },
      });
    } else if (search) {
      query.where.push({
        user: {
          username: ILike(`%${search}%`),
        },
      });
    }
    if (status) {
      query.where.push({
        status,
      });
    }
    query.relations = {
      orderDetails: true,
    };
    return this.orderRepository.findPagination(query);
  }

  /**
   * Finds and returns an order by its ID, including its order details.
   *
   * @param {string} id - The ID of the order to find.
   * @return {Promise<Order>} A promise that resolves to the found order,
   * including its order details.
   */
  findOne(id: string, user: User): Promise<Order> {
    const whereCondition: FindOptionsWhere<Order> = {
      id,
    };

    if (user.role.name === 'user') {
      whereCondition.user = { id: user.id };
    }

    const query: FindOneOptions<Order> = {
      where: whereCondition,
      relations: {
        orderDetails: true,
      },
    };

    return this.orderRepository.findOne(query);
  }
}
