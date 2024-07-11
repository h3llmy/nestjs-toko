import { ApiProperty } from '@nestjs/swagger';

export class ErrorMessageSchema {
  @ApiProperty({ type: 'string' })
  message: string;
}
