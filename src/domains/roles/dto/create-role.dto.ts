import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    description: 'The name of the role',
    example: 'admin',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The id of the permission',
    example: ['0d8e1e88-6c15-4aa8-ab33-2091ce62a27a'],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  permissionId?: string[];
}
