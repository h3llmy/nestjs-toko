import { ApiProperty } from '@nestjs/swagger';

export class LoginErrorValidationDto {
  @ApiProperty({ type: 'string', isArray: true })
  email: string[];

  @ApiProperty({ type: 'string', isArray: true })
  password: string[];
}
