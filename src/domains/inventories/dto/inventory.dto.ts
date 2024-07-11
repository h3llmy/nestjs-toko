import { ApiProperty } from '@nestjs/swagger';

export class InventoryDto {
  @ApiProperty({ type: 'string', example: '1', description: 'Inventory id' })
  id: string;

  @ApiProperty({
    type: 'number',
    example: 100,
    description: 'Inventory quantity',
  })
  quantity: number;

  @ApiProperty({
    type: 'string',
    example: '2022-01-01T00:00:00.000Z',
    description: 'Inventory update date',
  })
  updatedAt: Date;

  @ApiProperty({
    type: 'string',
    example: '2022-01-01T00:00:00.000Z',
    description: 'Inventory deletion date',
  })
  deletedAt: Date;
}
