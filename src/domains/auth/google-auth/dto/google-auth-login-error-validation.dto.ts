import { ApiProperty } from '@nestjs/swagger';

export class GoogleAuthLoginErrorValidationDto {
  @ApiProperty({
    type: 'array',
    description: 'Google access tokens',
    example: ['string'],
  })
  token: string[];
}
