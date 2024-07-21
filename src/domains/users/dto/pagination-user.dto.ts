import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SortDirection } from '@app/common';

export class UserOrder {
  @ApiPropertyOptional({
    name: 'order[username]',
    enum: SortDirection,
    description: 'Sort direction for username',
    required: false,
  })
  @IsOptional()
  @IsEnum(SortDirection)
  username?: SortDirection;

  @ApiPropertyOptional({
    name: 'order[email]',
    enum: SortDirection,
    description: 'Sort direction for email',
    required: false,
  })
  @IsOptional()
  @IsEnum(SortDirection)
  email?: SortDirection;

  @ApiPropertyOptional({
    name: 'order[createdAt]',
    enum: SortDirection,
    description: 'Sort direction for createdAt',
    required: false,
  })
  @IsOptional()
  @IsEnum(SortDirection)
  createdAt?: SortDirection;

  @ApiPropertyOptional({
    name: 'order[updatedAt]',
    enum: SortDirection,
    description: 'Sort direction for updatedAt',
    required: false,
  })
  @IsOptional()
  @IsEnum(SortDirection)
  updatedAt?: SortDirection;
}

export class PaginationUserDto {
  @ApiPropertyOptional({
    description: 'Page number (1-based index)',
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    minimum: 1,
    default: 10,
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(1)
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
    type: UserOrder,
    required: false,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UserOrder)
  order?: UserOrder;
}
