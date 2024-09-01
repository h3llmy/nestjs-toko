import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import {
  FileData,
  HasMimeType,
  IsFileData,
  MimeType,
} from 'nestjs-formdata-interceptor';

export class CreateProductDto {
  @ApiProperty({
    required: true,
    type: 'string',
    format: 'binary',
    isArray: true,
    name: 'images[]',
  })
  @IsFileData({ each: true })
  @IsNotEmpty({ each: true })
  @HasMimeType(
    [MimeType['image/jpeg'], MimeType['image/png'], MimeType['image/webp']],
    { each: true },
  )
  images: FileData[];

  @ApiProperty({
    description: 'Product name',
    example: 'Product 1',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Product price',
    example: 100000,
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'Product description',
    example: 'Product 1 description',
  })
  @IsString()
  @MaxLength(1000)
  description: string;

  @ApiProperty({
    description: 'Product quantity',
    example: 10,
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  quantity: number;

  @ApiProperty({
    description: 'Product category id',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID('4')
  categoryId: string;
}
