import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleErrorValidationDto {
  @ApiProperty({
    isArray: true,
    type: 'string',
  })
  name: string[];

  @ApiProperty({
    isArray: true,
    type: 'string',
  })
  permissionId: string[];
}
