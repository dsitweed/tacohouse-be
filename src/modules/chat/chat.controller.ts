import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { JwtGuard } from 'src/common/guard';
import { GetUser } from 'src/common/decorator';
import { SendMessageDto } from './dto/chat.dto';

@UseGuards(JwtGuard)
@Controller('chats')
@ApiTags('Chats')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post()
  sendMessage(@GetUser('id') userId: number, @Body() dto: SendMessageDto) {
    return dto;
  }
}
