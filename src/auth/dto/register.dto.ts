import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterRequest {
  @ApiProperty({
    example: 'John Doe',
    description: 'User name',
    maxLength: 50,
  })
  @IsString({ message: 'Name should be a string' })
  @IsNotEmpty({ message: 'Name should not be empty' })
  @MaxLength(50, { message: 'Name should not be longer than 50 characters' })
  username!: string;

  @ApiProperty({
    example: '12345678',
    description: 'User password',
    minLength: 6,
    maxLength: 120,
  })
  @IsString({ message: 'Password should be a string' })
  @IsNotEmpty({ message: 'Password should not be empty' })
  @MinLength(6, { message: 'Password should be at least 8 characters long' })
  @MaxLength(120, {
    message: 'Password should not be longer than 50 characters',
  })
  password!: string;
}
