import { ApiProperty } from '@nestjs/swagger';

export class InventoriesErrorValidationDto {
  @ApiProperty({
    type: 'string',
    isArray: true,
  })
  quantity: string[];
}
