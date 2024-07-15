import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

class ProductOrder {
  @ApiProperty({
    type: 'string',
    description: 'List of product ids',
  })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    type: 'number',
    description: 'Quantity of products',
  })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({
    type: [ProductOrder],
    description: 'List of products',
  })
  @IsNotEmpty()
  @ValidateNested()
  orders: ProductOrder[];
}
