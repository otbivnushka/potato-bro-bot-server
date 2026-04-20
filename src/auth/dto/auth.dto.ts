import { ApiProperty } from '@nestjs/swagger';

export class AuthResponse {
  @ApiProperty({ example: '<token>', description: 'JWT access token' })
  accessToken!: string;
}
