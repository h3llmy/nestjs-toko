import { ApiProperty } from '@nestjs/swagger';

export class ProductCategoryDto {
  @ApiProperty({ example: 1, description: 'Product category id' })
  id: number;

  @ApiProperty({ example: 'Category 1', description: 'Product category name' })
  name: string;

  @ApiProperty({
    example: '2022-01-01T00:00:00.000Z',
    description: 'Product category creation date',
  })
  createdAt: string;

  @ApiProperty({
    example: '2022-01-01T00:00:00.000Z',
    description: 'Product category update date',
  })
  updatedAt: string;

  @ApiProperty({
    example: '2022-01-01T00:00:00.000Z',
    description: 'Product category deletion date',
  })
  deletedAt: string;
}
