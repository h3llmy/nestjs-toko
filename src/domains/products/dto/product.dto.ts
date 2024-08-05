import { ApiProperty } from '@nestjs/swagger';
import { InventoryDto } from '@domains/inventories/dto/inventory.dto';
import { ProductCategoryDto } from '@domains/product-category/dto/product-category.dto';

export class ProductDto {
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

  @ApiProperty({
    example: '2022-01-01T00:00:00.000Z',
    description: 'Product creation date',
  })
  createdAt: string;

  @ApiProperty({
    example: '2022-01-01T00:00:00.000Z',
    description: 'Product update date',
  })
  updatedAt: string;

  @ApiProperty({
    example: '2022-01-01T00:00:00.000Z',
    description: 'Product deletion date',
  })
  deletedAt: string;

  @ApiProperty({
    type: ProductCategoryDto,
    description: 'Product category',
  })
  category?: ProductCategoryDto;

  @ApiProperty({
    type: InventoryDto,
    description: 'Product inventory',
  })
  inventory?: InventoryDto;
}
