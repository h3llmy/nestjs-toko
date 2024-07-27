import { ApiProperty } from '@nestjs/swagger';

export class PaymentOrderResponseDto {
  @ApiProperty({
    type: 'string',
    example: 'fd38a02d-0433-4bc6-860e-4d2ab24751c8',
    description: 'payment token',
  })
  token: string;

  @ApiProperty({
    type: 'string',
    example: 'https://www.example.com/fd38a02d-0433-4bc6-860e-4d2ab24751c8',
    description: 'payment url',
  })
  redirect_url: string;
}
