import { ApiProperty } from '@nestjs/swagger';

export class BasicSuccessSchema {
  @ApiProperty({ type: 'string' })
  message: string;
}
