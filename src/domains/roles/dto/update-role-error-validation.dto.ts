import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleErrorValidationDto {
  @ApiProperty({
    isArray: true,
    type: 'string',
  })
  name: string[];
}
