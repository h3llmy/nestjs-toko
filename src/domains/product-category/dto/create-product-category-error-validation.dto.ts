import { ApiProperty } from '@nestjs/swagger';

export class ProductCategoryErrorValidationDto {
  @ApiProperty({
    type: 'string',
    isArray: true,
  })
  name: string;
}
