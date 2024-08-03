import { ApiProperty } from '@nestjs/swagger';

export class ForgetPasswordErrorValidationDto {
  @ApiProperty({
    type: 'string',
    isArray: true,
  })
  email: string[];
}
