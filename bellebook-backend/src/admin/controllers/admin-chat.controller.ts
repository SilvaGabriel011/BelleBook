import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AdminChatService } from '../services/admin-chat.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('admin/chat')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminChatController {
  constructor(private chatService: AdminChatService) {}

  @Get('conversations')
  async getAllConversations(@Query() filters: any) {
    return this.chatService.getAllConversations(filters);
  }

  @Get('conversations/:id/messages')
  async getConversationMessages(
    @Param('id') id: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.chatService.getConversationMessages(
      id,
      skip ? parseInt(skip, 10) : undefined,
      take ? parseInt(take, 10) : undefined,
    );
  }

  @Post('conversations/:id/messages')
  async sendMessage(
    @Param('id') id: string,
    @Body() body: { content: string; attachments?: string[] },
    @Req() req: any,
  ) {
    return this.chatService.sendMessage(
      id,
      req.user.id,
      body.content,
      body.attachments,
    );
  }

  @Patch('conversations/:id/read')
  async markAsRead(@Param('id') id: string, @Req() req: any) {
    return this.chatService.markMessagesAsRead(id, req.user.id);
  }

  @Get('unread-count')
  async getUnreadCount() {
    return this.chatService.getUnreadCount();
  }

  @Post('conversations')
  async createConversation(
    @Body()
    body: {
      participantIds: string[];
      relatedBookingId?: string;
      tags?: string[];
    },
  ) {
    return this.chatService.createConversation(
      body.participantIds,
      body.relatedBookingId,
      body.tags,
    );
  }

  @Patch('conversations/:id/tags')
  async updateTags(@Param('id') id: string, @Body() body: { tags: string[] }) {
    return this.chatService.updateConversationTags(id, body.tags);
  }

  @Patch('conversations/:id/archive')
  async archiveConversation(@Param('id') id: string) {
    return this.chatService.archiveConversation(id);
  }
}
