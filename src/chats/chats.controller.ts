import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { JwtGuard } from '../auth/guards/auth.guard';

@Controller('chats')
@UseGuards(JwtGuard)
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post()
  create(@Req() req) {
    return this.chatsService.create(req.user.user_id);
  }

  @Get()
  findAll(@Req() req) {
    return this.chatsService.findAll(req.user.user_id);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.chatsService.findOne(req.user.user_id, +id);
  }

  @Patch(':id')
  update(@Req() req, @Param('id') id: string, @Body() dto: UpdateChatDto) {
    return this.chatsService.update(req.user.user_id, +id, dto);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.chatsService.remove(req.user.user_id, +id);
  }
}
