import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../entities/order.entity';
import { OrderDetailDto } from './order-detail.dto';

export class OrderDto {
  @ApiProperty({
    example: 1,
    description: 'Order id',
  })
  id: string;

  @ApiProperty({
    example: OrderStatus.PAID,
    description: 'Order status',
  })
  status: OrderStatus;

  @ApiProperty({
    example: 100000,
    description: 'Order total amount',
  })
  totalAmount: number;

  @ApiProperty({
    type: [OrderDetailDto],
    description: 'Order details',
  })
  orderDetails?: OrderDetailDto[];

  @ApiProperty({
    example: '2022-01-01T00:00:00.000Z',
    description: 'Order creation date',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2022-01-01T00:00:00.000Z',
    description: 'Order update date',
  })
  deletedAt: Date;
}
