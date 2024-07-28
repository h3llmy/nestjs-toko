import { ApiProperty } from '@nestjs/swagger';

export class RoleDto {
  @ApiProperty({
    type: 'string',
    example: '1',
    description: 'Role id',
  })
  id: string;

  @ApiProperty({
    type: 'string',
    example: 'admin',
    description: 'Role name',
  })
  name: string;

  @ApiProperty({
    type: 'date',
    example: '2022-01-01T00:00:00.000Z',
    description: 'Role created date',
  })
  createdAt: Date;

  @ApiProperty({
    type: 'date',
    example: '2022-01-01T00:00:00.000Z',
    description: 'Role last updated date',
  })
  updatedAt: Date;

  @ApiProperty({
    type: 'date',
    example: '2022-01-01T00:00:00.000Z',
    description: 'Role deleted date',
  })
  deletedAt: Date;
}
