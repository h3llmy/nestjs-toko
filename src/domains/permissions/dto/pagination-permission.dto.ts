import { SortDirection } from '@libs/database';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';

export class PermissionOrder {
  @ApiPropertyOptional({
    name: 'order[name]',
    enum: SortDirection,
    description: 'Sort direction for name',
    required: false,
  })
  @IsOptional()
  @IsEnum(SortDirection)
  name?: SortDirection;
}

export class PaginationPermissionDto {
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
  search?: string;

  @ApiPropertyOptional({
    description: 'Ordering criteria',
    type: PermissionOrder,
    required: false,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PermissionOrder)
  order?: PermissionOrder;
}
