import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export enum Courier {
  JNE = 'jne',
  TIKI = 'tiki',
  POS = 'pos',
}

export class CheckPriceCostDto {
  @ApiProperty({
    type: 'string',
    example: '501',
    description: 'Id origin of the package',
  })
  @IsString()
  @IsNotEmpty()
  origin: string;

  @ApiProperty({
    type: 'string',
    example: '114',
    description: 'Id destination of the package',
  })
  @IsString()
  @IsNotEmpty()
  destination: string;

  @ApiProperty({
    type: 'number',
    example: 1700,
    description: 'Weight of the package in gram',
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  weight: number;

  @ApiProperty({
    type: 'string',
    example: 'jne',
    description: 'Courier of the package',
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(Courier)
  courier: Courier;
}
