import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

class ProductOrder {
  @ApiProperty({
    type: 'string',
    description: 'List of product ids',
    example: 'fd38a02d-0433-4bc6-860e-4d2ab24751c8',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID('4')
  productId: string;

  @ApiProperty({
    type: 'number',
    description: 'Quantity of products',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({
    type: 'string',
    description: 'Discount id',
    example: 'fd38a02d-0433-4bc6-860e-4d2ab24751c8',
  })
  @IsOptional()
  @IsString()
  @IsUUID('4')
  discountId?: string;
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
