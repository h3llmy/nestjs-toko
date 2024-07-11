import { ApiProperty } from '@nestjs/swagger';
import { InventoryDto } from '../../../domains/inventories/dto/inventory.dto';

export class ProductInventoryDto {
  @ApiProperty({ example: 1, description: 'Product id' })
  id: string;

  @ApiProperty({ example: 'Product Name', description: 'Product name' })
  name: string;

  @ApiProperty({
    example: 'Product Description',
    description: 'Product description',
  })
  description: string;

  @ApiProperty({ example: 100000, description: 'Product price' })
  price: number;

  @ApiProperty({ type: InventoryDto })
  inventory: InventoryDto;
}
