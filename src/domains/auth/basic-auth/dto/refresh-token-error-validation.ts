import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenErrorValidationDto {
  @ApiProperty({
    type: 'string',
    isArray: true,
  })
  refreshToken: string[];
}
