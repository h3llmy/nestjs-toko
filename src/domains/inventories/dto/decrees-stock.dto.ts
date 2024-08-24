import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DecreaseStockDto {
  @ApiProperty({
    description: 'product quantity',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
