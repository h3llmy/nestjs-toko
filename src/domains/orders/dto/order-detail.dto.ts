import { ApiProperty } from '@nestjs/swagger';

export class OrderDetailDto {
  @ApiProperty({
    example: 1,
    description: 'Order id',
  })
  id: string;

  @ApiProperty({
    example: 'Product Name',
    description: 'Product name',
  })
  productName: string;

  @ApiProperty({
    example: 'Product Description',
    description: 'Product description',
  })
  productDescription: string;

  @ApiProperty({
    example: 100000,
    description: 'Product price',
  })
  productPrice: number;

  @ApiProperty({
    example: 'Discount Name',
    description: 'Discount name',
  })
  discountName?: string;

  @ApiProperty({
    example: 'Discount Description',
    description: 'Discount description',
  })
  discountDescription?: string;

  @ApiProperty({
    example: 'Discount Code',
    description: 'Discount code',
  })
  discountCode?: string;

  @ApiProperty({
    example: 10,
    description: 'Discount percentage',
  })
  discountPercentage?: number;

  @ApiProperty({
    example: 1,
    description: 'Discount start date',
  })
  discountStartDate?: number;

  @ApiProperty({
    example: 1,
    description: 'Discount end date',
  })
  discountEndDate?: number;

  @ApiProperty({
    example: 'Category Name',
    description: 'Category name',
  })
  categoryName: string;

  @ApiProperty({
    example: 1,
    description: 'Quantity',
  })
  quantity: number;

  @ApiProperty({
    example: 100000,
    description: 'Total price',
  })
  totalPrice: number;
}
