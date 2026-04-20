import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Injectable()
export class ChatsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number) {
    return this.prisma.chat.create({
      data: {
        title: 'Новый чат',
        user_id: userId,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.chat.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async findOne(userId: number, chatId: number) {
    const chat = await this.prisma.chat.findFirst({
      where: {
        chat_id: chatId,
        user_id: userId,
      },
      include: {
        messages: true,
      },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    return chat;
  }

  async update(userId: number, chatId: number, dto: UpdateChatDto) {
    await this.findOne(userId, chatId);

    return this.prisma.chat.update({
      where: { chat_id: chatId },
      data: dto,
    });
  }

  async remove(userId: number, chatId: number) {
    await this.findOne(userId, chatId);

    return this.prisma.chat.delete({
      where: { chat_id: chatId },
    });
  }
}
