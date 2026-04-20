import { IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({
    example: 1,
    description: 'ID чата',
  })
  @IsInt()
  chatId!: number;

  @ApiProperty({
    example: 'Привет, как дела?',
    description: 'Текст сообщения пользователя',
    maxLength: 4000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(4000)
  content!: string;
}
