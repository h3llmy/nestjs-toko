import { ApiProperty } from '@nestjs/swagger';

export class PermissionDto {
  @ApiProperty({
    example: '6014813b-eb31-4c41-9bbb-08d2b9a604a5',
    description: 'Permission ID',
  })
  id: string;

  @ApiProperty({
    example: 'admin',
    description: 'Permission name',
  })
  name: string;
}
