import { ApiProperty } from '@nestjs/swagger';
import { ProductDto } from '@domains/products/dto/product.dto';

export class DiscountDto {
  @ApiProperty({
    type: 'string',
    example: '3931b395-da7a-47d4-976c-9de487abfde4',
  })
  id: string;

  @ApiProperty({
    type: 'string',
    example: '10% off',
  })
  name: string;

  @ApiProperty({
    type: 'string',
    example: '10% off on all products',
  })
  description: string;

  @ApiProperty({
    type: 'string',
    example: '10OFF',
  })
  code: string;

  @ApiProperty({
    type: 'number',
    example: 10,
  })
  percentage: number;

  @ApiProperty({
    type: 'number',
    example: 1,
  })
  startDate: number;

  @ApiProperty({
    type: 'number',
    example: 1,
  })
  endDate: number;

  @ApiProperty({
    type: ProductDto,
    isArray: true,
  })
  products: ProductDto[];

  @ApiProperty({
    type: 'date',
    example: '2022-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    type: 'date',
    example: '2022-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    type: 'date',
    example: '2022-01-01T00:00:00.000Z',
  })
  deletedAt: Date;
}
