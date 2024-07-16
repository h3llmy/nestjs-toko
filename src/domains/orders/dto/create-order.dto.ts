import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
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
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({
    type: [ProductOrder],
    description: 'List of products',
  })
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => ProductOrder)
  orders: ProductOrder[];
}
