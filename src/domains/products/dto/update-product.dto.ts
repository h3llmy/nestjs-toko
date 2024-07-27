import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Product 1',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Product price',
    example: 100000,
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'Product description',
    example: 'Product 1 description',
  })
  @IsString()
  @MaxLength(1000)
  description: string;

  @ApiProperty({
    description: 'Product category id',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID('4')
  categoryId: string;
}
