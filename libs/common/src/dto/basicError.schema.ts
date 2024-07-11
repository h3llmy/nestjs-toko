import { ApiProperty } from '@nestjs/swagger';

export class BasicErrorSchema {
  @ApiProperty({ type: 'string' })
  error: string;

  @ApiProperty({ type: 'string' })
  message: string;
}
