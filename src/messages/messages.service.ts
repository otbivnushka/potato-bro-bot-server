import { Inject, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { processMessage } from 'potato-chat-engine';
import sleep from 'src/utils/sleep';
import { Logger } from 'logger';
import { LOGGER } from 'src/logger/logger.token';

@Injectable()
export class MessagesService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(LOGGER) private readonly logger: Logger,
  ) {}

  async stream(userId: number, dto: CreateMessageDto, res: Response) {
    const { chatId, content } = dto;

    const userMessage = await this.prisma.message.create({
      data: {
        chat_id: chatId,
        role: 'user',
        content,
      },
    });

    this.logger.userMessage(content, String(userId));

    const chat = await this.prisma.chat.findUniqueOrThrow({
      where: { chat_id: chatId },
    });

    if (chat.title === 'Новый чат') {
      await this.prisma.chat.update({
        where: { chat_id: chatId },
        data: {
          title: content,
        },
      });
    }

    const selectedCharactersPrompt = await this.prisma.userSettings.findUniqueOrThrow({
      where: { user_id: userId },
      select: {
        character: {
          select: {
            prompt: true,
          },
        },
      },
    });

    const prompt = selectedCharactersPrompt.character?.prompt || '';

    res.write(`event: user\n`);
    res.write(`data: ${JSON.stringify(userMessage)}\n\n`);

    const result = await processMessage(
      {
        message: content,
      },
      {
        ai: {
          apiKey: process.env.GEMINI_API_KEY,
          model: 'gemini-2.5-flash-lite',
          systemInstruction: prompt,
        },
      },
    );

    const message = result.content;

    for (let index = 0; index < message.length; index += 10) {
      const text = message.slice(index, index + 10);

      res.write(`event: chunk\n`);
      res.write(`data: ${JSON.stringify({ text })}\n\n`);

      await sleep(50);
    }

    const botMessage = await this.prisma.message.create({
      data: {
        chat_id: chatId,
        role: 'bot',
        content: message,
      },
    });

    this.logger.botMessage(message, {
      userId,
      model: 'gemini',
    });

    res.write(`event: done\n`);
    res.write(`data: ${JSON.stringify(botMessage)}\n\n`);

    res.end();
  }

  async findAll(userId: number, chatId: number) {
    return this.prisma.message.findMany({
      where: {
        chat_id: chatId,
        chat: {
          user_id: userId,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
}
