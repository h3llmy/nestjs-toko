import { ApiProperty } from '@nestjs/swagger';
import { Courier } from './check-price-cost.dto';

export class CheckPriceCostErrorValidationDto {
  @ApiProperty({
    isArray: true,
    type: 'string',
  })
  origin: string;

  @ApiProperty({
    isArray: true,
    type: 'string',
  })
  destination: string;

  @ApiProperty({
    isArray: true,
    type: 'string',
  })
  weight: number;

  @ApiProperty({
    isArray: true,
    type: 'string',
  })
  courier: Courier;
}
