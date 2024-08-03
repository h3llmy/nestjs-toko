import { ApiProperty } from '@nestjs/swagger';
import { SocialAuthResponse } from '../../social-auth.abstract';

export class GoogleAuthLoginResponseDto extends SocialAuthResponse {
  @ApiProperty({
    type: 'string',
    description: 'Google id',
    example: 'some id',
  })
  id: string;

  @ApiProperty({
    type: 'string',
    description: 'Google email',
    example: 'some email',
  })
  email: string;

  @ApiProperty({
    type: 'string',
    description: 'Google username',
    example: 'some username',
  })
  username: string;
}
