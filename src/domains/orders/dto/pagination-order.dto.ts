import { SortDirection } from '@app/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { OrderStatus } from '../entities/order.entity';

export class OrderOrder {
  @ApiPropertyOptional({
    name: 'order[totalAmount]',
    enum: SortDirection,
    description: 'Sort direction for totalAmount',
    required: false,
  })
  @IsOptional()
  @IsEnum(SortDirection)
  totalAmount?: SortDirection;

  @ApiPropertyOptional({
    name: 'order[createdAt]',
    enum: SortDirection,
    description: 'Sort direction for createdAt',
    required: false,
  })
  @IsOptional()
  @IsEnum(SortDirection)
  createdAt?: SortDirection;
}

export class PaginationOrderDto {
  @ApiPropertyOptional({
    description: 'Page number (1-based index)',
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({
    description: 'Page size',
    minimum: 1,
    default: 10,
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({
    description: 'Search query',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'status filter',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional({
    name: 'order',
    type: OrderOrder,
    description: 'Sort order',
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderOrder)
  order?: OrderOrder;
}
