import { mixin } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export const paginationSchemaFactory = <T = any>(
  schema: new (...args: any[]) => T,
) => {
  class PaginationSchema {
    @ApiProperty({ type: 'number', example: 1 })
    totalData: number;

    @ApiProperty({ type: 'number', example: 1 })
    totalPages: number;

    @ApiProperty({ type: 'number', example: 1 })
    page: number;

    @ApiProperty({ type: 'number', example: 10 })
    limit: number;

    @ApiProperty({ type: schema, isArray: true })
    data: T[];
  }

  return mixin<PaginationSchema>(PaginationSchema);
};
