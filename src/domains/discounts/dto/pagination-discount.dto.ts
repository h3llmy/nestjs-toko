import { ToBoolean } from '@libs/common';
import { SortDirection } from '@libs/database';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class DiscountCategoryOrder {
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
    name: 'order[code]',
    enum: SortDirection,
    description: 'Sort direction for code',
    required: false,
  })
  @IsOptional()
  @IsEnum(SortDirection)
  code?: SortDirection;

  @ApiPropertyOptional({
    name: 'order[startDate]',
    enum: SortDirection,
    description: 'Sort direction for start date',
    required: false,
  })
  @IsOptional()
  @IsEnum(SortDirection)
  startDate?: SortDirection;

  @ApiPropertyOptional({
    name: 'order[endDate]',
    enum: SortDirection,
    description: 'Sort direction for end date',
    required: false,
  })
  @IsOptional()
  @IsEnum(SortDirection)
  endDate?: SortDirection;

  @ApiPropertyOptional({
    name: 'order[updatedAt]',
    enum: SortDirection,
    description: 'Sort direction for updated at',
    required: false,
  })
  @IsOptional()
  @IsEnum(SortDirection)
  updatedAt?: SortDirection;

  @ApiPropertyOptional({
    name: 'order[createdAt]',
    enum: SortDirection,
    description: 'Sort direction for created at',
    required: false,
  })
  @IsOptional()
  @IsEnum(SortDirection)
  createdAt?: SortDirection;
}

export class PaginationDiscountDto {
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
    name: 'isActive',
    type: Boolean,
    description: 'Filter by active status',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    name: 'order',
    type: DiscountCategoryOrder,
    description: 'Sort order',
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => DiscountCategoryOrder)
  order?: DiscountCategoryOrder;
}
