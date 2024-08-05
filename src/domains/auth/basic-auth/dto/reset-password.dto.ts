import { IsMatchWith } from '@libs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'new user password',
    example: 'password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'user password confirmation',
    example: 'password',
  })
  @IsString()
  @IsMatchWith('password')
  confirmPassword: string;
}
