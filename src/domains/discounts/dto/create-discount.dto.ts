import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateDiscountDto {
  @ApiProperty({
    type: 'string',
    isArray: true,
    description: 'Product id',
    example: ['3931b395-da7a-47d4-976c-9de487abfde4'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  productId: string[];

  @ApiProperty({
    type: 'string',
    description: 'Discount name',
    example: '10% off',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    type: 'string',
    description: 'Discount description',
    example: '10% off on all products',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  description: string;

  @ApiProperty({
    type: 'string',
    description: 'Discount code',
    example: '10OFF',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  code: string;

  @ApiProperty({
    type: 'number',
    description: 'Discount percentage',
    example: 10,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  percentage: number;

  @ApiProperty({
    type: 'number',
    description: 'Discount start date',
    example: 1630000000,
  })
  @IsNotEmpty()
  @IsNumber()
  startDate: number;

  @ApiProperty({
    type: 'number',
    description: 'Discount end date',
    example: 1640000000,
  })
  @IsNotEmpty()
  @IsNumber()
  endDate: number;
}
