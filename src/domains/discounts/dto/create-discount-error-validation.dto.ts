import { ApiProperty } from '@nestjs/swagger';

export class CreateDiscountErrorValidationDto {
  @ApiProperty({
    type: 'string',
    isArray: true,
  })
  productId: string[];

  @ApiProperty({
    type: 'string',
    isArray: true,
  })
  name: string[];

  @ApiProperty({
    type: 'string',
    isArray: true,
  })
  description: string[];

  @ApiProperty({
    type: 'string',
    isArray: true,
  })
  code: string[];

  @ApiProperty({
    type: 'string',
    isArray: true,
  })
  percentage: string[];

  @ApiProperty({
    type: 'string',
    isArray: true,
  })
  startDate: string[];

  @ApiProperty({
    type: 'string',
    isArray: true,
  })
  endDate: string[];
}
