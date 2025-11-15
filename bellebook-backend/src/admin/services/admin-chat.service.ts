import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminChatService {
  constructor(private prisma: PrismaService) {}

  async getAllConversations(filters?: {
    status?: string;
    hasUnread?: boolean;
    tags?: string[];
    skip?: number;
    take?: number;
  }) {
    const where: any = {};

    if (filters?.status) where.status = filters.status;
    if (filters?.tags && filters.tags.length > 0) {
      where.tags = { contains: filters.tags[0] };
    }

    const conversations = await this.prisma.chatConversation.findMany({
      where,
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                displayName: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            messages: {
              where: { isRead: false },
            },
          },
        },
      },
      orderBy: { lastMessageAt: 'desc' },
      skip: filters?.skip || 0,
      take: filters?.take || 50,
    });

    return conversations.map((conv) => ({
      id: conv.id,
      participantIds: JSON.parse(conv.participantIds),
      lastMessage: conv.messages[0] || null,
      lastMessageAt: conv.lastMessageAt,
      unreadCount: conv._count.messages,
      relatedBookingId: conv.relatedBookingId,
      tags: conv.tags ? JSON.parse(conv.tags) : [],
      status: conv.status,
    }));
  }

  async getConversationMessages(conversationId: string, skip?: number, take?: number) {
    const conversation = await this.prisma.chatConversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                displayName: true,
                avatar: true,
                role: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip: skip || 0,
          take: take || 50,
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversa não encontrada');
    }

    return {
      id: conversation.id,
      participantIds: JSON.parse(conversation.participantIds),
      messages: conversation.messages.reverse(),
      relatedBookingId: conversation.relatedBookingId,
      tags: conversation.tags ? JSON.parse(conversation.tags) : [],
    };
  }

  async sendMessage(conversationId: string, senderId: string, content: string, attachments?: string[]) {
    const conversation = await this.prisma.chatConversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversa não encontrada');
    }

    const message = await this.prisma.chatMessage.create({
      data: {
        conversationId,
        senderId,
        content,
        attachments: attachments ? JSON.stringify(attachments) : null,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            displayName: true,
            avatar: true,
            role: true,
          },
        },
      },
    });

    await this.prisma.chatConversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    });

    return message;
  }

  async markMessagesAsRead(conversationId: string, userId: string) {
    await this.prisma.chatMessage.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return { message: 'Mensagens marcadas como lidas' };
  }

  async getUnreadCount() {
    const count = await this.prisma.chatMessage.count({
      where: { isRead: false },
    });

    return { unreadCount: count };
  }

  async createConversation(participantIds: string[], relatedBookingId?: string, tags?: string[]) {
    const conversation = await this.prisma.chatConversation.create({
      data: {
        participantIds: JSON.stringify(participantIds),
        relatedBookingId,
        tags: tags ? JSON.stringify(tags) : null,
      },
    });

    return conversation;
  }

  async updateConversationTags(conversationId: string, tags: string[]) {
    await this.prisma.chatConversation.update({
      where: { id: conversationId },
      data: { tags: JSON.stringify(tags) },
    });

    return { message: 'Tags atualizadas' };
  }

  async archiveConversation(conversationId: string) {
    await this.prisma.chatConversation.update({
      where: { id: conversationId },
      data: { status: 'ARCHIVED' },
    });

    return { message: 'Conversa arquivada' };
  }
}
