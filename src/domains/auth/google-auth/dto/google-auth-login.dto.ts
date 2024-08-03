import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleAuthLoginDto {
  @ApiProperty({
    type: 'string',
    description: 'Google access token',
    example: 'some access token',
  })
  @IsNotEmpty()
  @IsString()
  token: string;
}
