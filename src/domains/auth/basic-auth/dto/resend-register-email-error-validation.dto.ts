import { ApiProperty } from '@nestjs/swagger';

export class ResendRegisterEmailErrorValidationDto {
  @ApiProperty({
    type: 'string',
    isArray: true,
  })
  email: string;
}
