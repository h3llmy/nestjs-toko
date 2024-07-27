import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
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
  IPaginationResponse,
  Permission,
  validationErrorSchemaFactory,
} from '@app/common';
import { Role, User } from '../users/entities/user.entity';
import { PaymentCheckDto, PaymentOrderResponseDto } from '@app/payment-gateway';
import { PaginationOrderDto } from './dto/pagination-order.dto';
import { Order } from './entities/order.entity';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Permission(Role.USER)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'The order has been successfully created',
    type: PaymentOrderResponseDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'order validation error',
    type: validationErrorSchemaFactory(BasicErrorSchema),
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
  create(
    @Body() createOrderDto: CreateOrderDto,
    @Auth() user: User,
  ): Promise<PaymentOrderResponseDto> {
    return this.ordersService.create(createOrderDto, user);
  }

  @Post('notification')
  async notification(
    @Body() notificationDto: PaymentCheckDto,
  ): Promise<BasicSuccessSchema> {
    await this.ordersService.notification(notificationDto);

    return { message: 'success' };
  }

  @Get()
  @Permission('Authorize')
  @ApiBearerAuth()
  findPagination(
    @Query() findQuery: PaginationOrderDto,
    @Auth() user: User,
  ): Promise<IPaginationResponse<Order>> {
    return this.ordersService.findPagination(findQuery, user);
  }

  @Get(':id')
  @Permission('Authorize')
  @ApiBearerAuth()
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Auth() user: User,
  ): Promise<Order> {
    return this.ordersService.findOne(id, user);
  }
}
