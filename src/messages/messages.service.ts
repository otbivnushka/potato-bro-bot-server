import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Response } from 'express';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: 'AIzaSyDDx2EjAQ32UduWWU30fQE2m2iDP-B-WbQ',
});

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async stream(userId: number, dto: CreateMessageDto, res: Response) {
    const { chatId, content } = dto;

    // 1. сохраняем user message
    const userMessage = await this.prisma.message.create({
      data: {
        chat_id: chatId,
        role: 'user',
        content,
      },
    });

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

    // отправляем событие о user message (опционально)
    res.write(`event: user\n`);
    res.write(`data: ${JSON.stringify(userMessage)}\n\n`);

    // 2. запускаем Gemini stream
    const stream = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash-lite',
      contents: content,
      config: {
        systemInstruction: prompt,
      },
    });

    let fullText = '';

    // 3. стримим чанки
    for await (const chunk of stream) {
      const text = chunk.text || '';
      fullText += text;

      res.write(`event: chunk\n`);
      res.write(`data: ${JSON.stringify({ text })}\n\n`);
    }

    // 4. сохраняем финальный ответ
    const botMessage = await this.prisma.message.create({
      data: {
        chat_id: chatId,
        role: 'bot',
        content: fullText,
      },
    });

    // 5. отправляем финал
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
