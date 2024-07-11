import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateProductCategoryDto {
  @ApiProperty({
    description: 'Product category name',
    example: 'Category 1',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}
