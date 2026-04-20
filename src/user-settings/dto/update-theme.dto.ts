import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateThemeDto {
  @IsString()
  @IsNotEmpty()
  theme!: string;
}
