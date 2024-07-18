import { ApiProperty } from '@nestjs/swagger';

export class ProductErrorValidationDto {
  @ApiProperty({
    isArray: true,
    type: 'string',
  })
  name: string;

  @ApiProperty({
    isArray: true,
    type: 'string',
  })
  description: string;

  @ApiProperty({
    isArray: true,
    type: 'string',
  })
  price: number;

  @ApiProperty({
    isArray: true,
    type: 'string',
  })
  quantity: number;

  @ApiProperty({
    isArray: true,
    type: 'string',
  })
  categoryId: string;
}
