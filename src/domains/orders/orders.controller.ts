import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth, Permission } from '@app/common';
import { Role, User } from '../users/entities/user.entity';
import { PaymentCheckDto } from '@app/payment-gateway';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  // @Permission(Role.USER)
  @ApiBearerAuth()
  create(@Body() createOrderDto: CreateOrderDto, @Auth() user: User) {
    return this.ordersService.create(createOrderDto, user);
  }

  @Post('notification')
  async notification(@Body() payload: PaymentCheckDto) {
    await this.ordersService.notification(payload);

    return { message: 'success' };
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.ordersService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.ordersService.remove(id);
  }
}
