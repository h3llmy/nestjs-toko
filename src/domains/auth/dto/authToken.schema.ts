import { ApiProperty } from '@nestjs/swagger';

export class AuthTokenSchema {
  @ApiProperty({ type: 'string' })
  accessToken: string;

  @ApiProperty({ type: 'string' })
  refreshToken: string;
}
