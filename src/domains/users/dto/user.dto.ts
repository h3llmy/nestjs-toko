import { ApiProperty } from '@nestjs/swagger';
import { RoleDto } from '@domains/roles/dto/role.dto';

export class UserDto {
  @ApiProperty({
    type: 'string',
    example: 'test',
    description: 'User name',
  })
  username: string;

  @ApiProperty({
    type: 'string',
    example: 'example@example.com',
    description: 'User email',
  })
  email: string;

  @ApiProperty({
    type: RoleDto,
    description: 'User role',
  })
  role: RoleDto;

  @ApiProperty({
    type: 'number',
    example: 1720716083078,
    description: 'email verified at date',
  })
  emailVerifiedAt: number;

  @ApiProperty({
    type: 'string',
    example: 'test',
    description: 'User created date',
  })
  createdAt: Date;

  @ApiProperty({
    type: 'string',
    example: 'test',
    description: 'User last updated date',
  })
  updatedAt: Date;
}
