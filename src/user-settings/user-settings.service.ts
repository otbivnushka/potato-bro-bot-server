import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(userId: number) {
    return this.getOrCreateSettings(userId);
  }

  async updateTheme(userId: number, theme: string) {
    await this.getOrCreateSettings(userId);
    const settings = await this.prisma.userSettings.update({
      where: { user_id: userId },
      data: { theme },
      include: {
        character: true,
      },
    });
    return { theme: settings.theme, character_id: settings.character_id };
  }

  async updateCharacter(userId: number, characterId?: number) {
    await this.getOrCreateSettings(userId);

    if (characterId !== undefined) {
      const character = await this.prisma.character.findUnique({
        where: { id: characterId },
      });

      if (!character) {
        throw new NotFoundException('Character not found');
      }
    }

    const settings = await this.prisma.userSettings.update({
      where: { user_id: userId },
      data: {
        character_id: characterId ?? null,
      },
      include: {
        character: true,
      },
    });
    return { theme: settings.theme, character_id: settings.character_id };
  }

  private async getOrCreateSettings(userId: number) {
    const settings = await this.prisma.userSettings.upsert({
      where: { user_id: userId },
      update: {},
      create: { user_id: userId },
      include: {
        character: true,
      },
    });

    return { theme: settings.theme, character_id: settings.character_id };
  }
}
