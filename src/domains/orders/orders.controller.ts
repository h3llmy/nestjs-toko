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
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import {
  Auth,
  BasicSuccessSchema,
  IPaginationResponse,
  Permission,
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
