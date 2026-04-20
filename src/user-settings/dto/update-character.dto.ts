import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class UpdateCharacterDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  character_id?: number;
}
