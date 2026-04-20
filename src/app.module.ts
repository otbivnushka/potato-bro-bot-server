import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ChatsModule } from './chats/chats.module';
import { MessagesModule } from './messages/messages.module';
import { CharactersModule } from './characters/characters.module';
import { UserSettingsModule } from './user-settings/user-settings.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    ChatsModule,
    MessagesModule,
    CharactersModule,
    UserSettingsModule,
    LoggerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
