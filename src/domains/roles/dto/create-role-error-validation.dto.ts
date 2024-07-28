import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleErrorValidationDto {
  @ApiProperty({
    isArray: true,
    type: 'string',
  })
  name: string[];
}
