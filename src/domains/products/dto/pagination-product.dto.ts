import { SortDirection } from '@app/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class ProductOrder {
  @ApiPropertyOptional({
    name: 'order[name]',
    enum: SortDirection,
    description: 'Sort direction for name',
    required: false,
  })
  @IsOptional()
  @IsEnum(SortDirection)
  name?: SortDirection;

  @ApiPropertyOptional({
    name: 'order[price]',
    enum: SortDirection,
    description: 'Sort direction for price',
    required: false,
  })
  @IsOptional()
  @IsEnum(SortDirection)
  price?: SortDirection;

  @ApiPropertyOptional({
    name: 'order[createdAt]',
    enum: SortDirection,
    description: 'Sort direction for created at',
    required: false,
  })
  @IsOptional()
  @IsEnum(SortDirection)
  createdAt?: SortDirection;

  @ApiPropertyOptional({
    name: 'order[updatedAt]',
    enum: SortDirection,
    description: 'Sort direction for updated at',
    required: false,
  })
  @IsOptional()
  @IsEnum(SortDirection)
  updatedAt?: SortDirection;
}

export class PaginationProductDto {
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
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: 'Ordering criteria',
    type: ProductOrder,
    required: false,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ProductOrder)
  order?: ProductOrder;
}
