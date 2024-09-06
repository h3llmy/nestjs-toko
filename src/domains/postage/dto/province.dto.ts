import { ApiProperty } from '@nestjs/swagger';

export class PostageProvinceDto {
  @ApiProperty({
    type: 'string',
    example: '1',
    description: 'Province id',
  })
  province_id: string;

  @ApiProperty({
    type: 'string',
    example: 'Jawa Barat',
    description: 'Province name',
  })
  province: string;
}
