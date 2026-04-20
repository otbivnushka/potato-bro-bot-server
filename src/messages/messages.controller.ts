import { Controller, Post, Body, Param, Req, Res, Get } from '@nestjs/common';
import type { Response } from 'express';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('stream')
  async stream(@Req() req, @Res() res: Response, @Body() dto: CreateMessageDto) {
    const userId = req.user?.user_id;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    await this.messagesService.stream(userId, dto, res);
  }

  @Get(':chatId')
  async findAll(@Req() req, @Param('chatId') chatId: string) {
    const userId = req.user?.user_id;
    return this.messagesService.findAll(userId, +chatId);
  }
}
