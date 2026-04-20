import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { UserSettingsService } from './user-settings.service';
import { JwtGuard } from '../auth/guards/auth.guard';
import { UpdateThemeDto } from './dto/update-theme.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';

@Controller('user-settings')
@UseGuards(JwtGuard)
export class UserSettingsController {
  constructor(private readonly userSettingsService: UserSettingsService) {}

  @Get()
  findOne(@Req() req) {
    return this.userSettingsService.findOne(req.user.user_id);
  }

  @Patch('theme')
  updateTheme(@Req() req, @Body() dto: UpdateThemeDto) {
    return this.userSettingsService.updateTheme(req.user.user_id, dto.theme);
  }

  @Patch('character')
  updateCharacter(@Req() req, @Body() dto: UpdateCharacterDto) {
    return this.userSettingsService.updateCharacter(req.user.user_id, dto.characterId);
  }
}
