import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileErrorValidationDto {
  @ApiProperty({
    isArray: true,
    type: 'string',
  })
  username: string[];

  @ApiProperty({
    isArray: true,
    type: 'string',
  })
  password: string[];
}
