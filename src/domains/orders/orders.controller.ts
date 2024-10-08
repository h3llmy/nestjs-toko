import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import {
  Auth,
  BasicErrorSchema,
  BasicSuccessSchema,
  ErrorMessageSchema,
  paginationSchemaFactory,
  Permission,
  validationErrorSchemaFactory,
} from '@libs/common';
import { User } from '@domains/users/entities/user.entity';
import {
  PaymentCheckDto,
  PaymentOrderResponseDto,
} from '@libs/payment-gateway';
import { PaginationOrderDto } from './dto/pagination-order.dto';
import { Order } from './entities/order.entity';
import { CreateOrderValidationErrorDto } from './dto/create-order-validation-error.dto';
import { OrderDto } from './dto/order.dto';
import { OrderNotificationValidationErrorDto } from './dto/order-notification-validator-error.dto';
import { IPaginationResponse } from '@libs/database';
import { MailService } from '@domains/mail/mail.service';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly mailService: MailService,
  ) {}

  @Post()
  @Permission('create order')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create order' })
  @ApiCreatedResponse({
    description: 'The order has been successfully created',
    type: PaymentOrderResponseDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'order validation error',
    type: validationErrorSchemaFactory(CreateOrderValidationErrorDto),
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: BasicErrorSchema,
  })
  @ApiNotFoundResponse({
    description: 'Not found',
    type: BasicErrorSchema,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: BasicErrorSchema,
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many requests',
    type: ErrorMessageSchema,
  })
  @ApiServiceUnavailableResponse({
    description: 'Service Unavailable',
    type: BasicErrorSchema,
  })
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @Auth() user: User,
  ): Promise<PaymentOrderResponseDto> {
    const { redirect_url, token, ...order } = await this.ordersService.create(
      createOrderDto,
      user,
    );
    this.mailService.sendCreateOrderMail(user, order);
    return {
      token,
      redirect_url,
    };
  }

  @Post('notification')
  @ApiOperation({
    summary: 'Payment Gateway Notification',
    description:
      'this endpoint is for payment gateway to send order status update notification to our server',
  })
  @ApiOkResponse({
    description: 'The order has been successfully created',
    type: BasicSuccessSchema,
  })
  @ApiUnprocessableEntityResponse({
    description: 'order validation error',
    type: validationErrorSchemaFactory(OrderNotificationValidationErrorDto),
  })
  @ApiNotFoundResponse({
    description: 'Not found',
    type: BasicErrorSchema,
  })
  @ApiServiceUnavailableResponse({
    description: 'Service Unavailable',
    type: BasicErrorSchema,
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many requests',
    type: ErrorMessageSchema,
  })
  async notification(
    @Body() notificationDto: PaymentCheckDto,
  ): Promise<BasicSuccessSchema> {
    await this.ordersService.notification(notificationDto);

    return { message: 'success' };
  }

  @Get()
  @Permission('get all orders')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find all orders' })
  @ApiOkResponse({
    description: 'The found orders',
    type: paginationSchemaFactory(OrderDto),
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: BasicErrorSchema,
  })
  @ApiNotFoundResponse({
    description: 'Not found',
    type: BasicErrorSchema,
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many requests',
    type: ErrorMessageSchema,
  })
  findPagination(
    @Query() findQuery: PaginationOrderDto,
    @Auth() user: User,
  ): Promise<IPaginationResponse<Order>> {
    return this.ordersService.findPagination(findQuery, user);
  }

  @Get(':id')
  @Permission('get order by id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find order by id' })
  @ApiOkResponse({
    description: 'The found order',
    type: OrderDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: BasicErrorSchema,
  })
  @ApiNotFoundResponse({
    description: 'Not found',
    type: BasicErrorSchema,
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many requests',
    type: ErrorMessageSchema,
  })
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Auth() user: User,
  ): Promise<Order> {
    const order = await this.ordersService.findOne(id, user);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }
}
