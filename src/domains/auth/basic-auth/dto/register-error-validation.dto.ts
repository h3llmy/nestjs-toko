import { ApiProperty } from '@nestjs/swagger';

export class RegisterErrorValidationDto {
  @ApiProperty({
    type: 'string',
    isArray: true,
  })
  username: string[];

  @ApiProperty({
    type: 'string',
    isArray: true,
  })
  email: string[];

  @ApiProperty({
    type: 'string',
    isArray: true,
  })
  password: string[];

  @ApiProperty({
    type: 'string',
    isArray: true,
  })
  confirmPassword: string[];
}
