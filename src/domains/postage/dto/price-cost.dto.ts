import { ApiProperty } from '@nestjs/swagger';

export class CostDto {
  @ApiProperty({
    type: 'number',
    example: 10000,
    description: 'Cost value',
  })
  value: number;

  @ApiProperty({
    type: 'string',
    example: '10',
    description: 'Cost etd',
  })
  etd: string;

  @ApiProperty({
    type: 'string',
    example: 'some note',
    description: 'Cost note',
  })
  note: string;
}

export class CostsDto {
  @ApiProperty({
    type: 'string',
    example: 'REG',
    description: 'Service name',
  })
  service: string;

  @ApiProperty({
    type: 'string',
    example: 'Layanan Reguler',
    description: 'Service description',
  })
  description: string;

  @ApiProperty({
    type: CostDto,
    description: 'Costs',
    isArray: true,
  })
  cost: CostDto[];
}

export class PriceCostDto {
  @ApiProperty({
    type: 'string',
    example: 'jne',
    description: 'Courier name',
  })
  code: string;

  @ApiProperty({
    type: 'string',
    example: 'Jalur Nugraha Ekakurir (JNE)',
    description: 'Service name',
  })
  name: string;

  @ApiProperty({
    type: CostsDto,
    description: 'Costs',
    isArray: true,
  })
  costs: CostsDto[];
}
