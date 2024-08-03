import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsMatchWith } from '@app/common';

export class RegisterUserDto {
  @ApiProperty({
    description: 'Username of the user',
    example: 'username123',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Email of the user',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'Password123!',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Confirmation user password',
    example: 'Password123!',
  })
  @IsString()
  @IsMatchWith('password')
  confirmPassword: string;
}
