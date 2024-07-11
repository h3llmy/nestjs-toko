import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordErrorValidationDto {
  @ApiProperty({ type: 'string', isArray: true })
  password: string[];

  @ApiProperty({ type: 'string', isArray: true })
  confirmPassword: string[];
}
