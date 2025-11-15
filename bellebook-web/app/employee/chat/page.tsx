'use client';

import { useState } from 'react';
import { Send, Search, Phone, Video, MoreVertical, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>('1');
  const [message, setMessage] = useState('');

  const conversations = [
    {
      id: '1',
      customer: {
        name: 'Maria Silva',
        avatar: null,
      },
      lastMessage: 'Confirmo para amanhã às 10h!',
      time: '12:30',
      unread: 2,
      online: true,
    },
    {
      id: '2',
      customer: {
        name: 'Ana Costa',
        avatar: null,
      },
      lastMessage: 'Obrigada pelo ótimo atendimento!',
      time: 'Ontem',
      unread: 0,
      online: false,
    },
  ];

  const messages = [
    {
      id: '1',
      sender: 'customer',
      content: 'Olá! Gostaria de confirmar meu agendamento',
      time: '12:25',
    },
    {
      id: '2',
      sender: 'me',
      content: 'Oi Maria! Claro, você tem agendamento amanhã às 10h para manicure e pedicure.',
      time: '12:27',
    },
    {
      id: '3',
      sender: 'customer',
      content: 'Perfeito! Confirmo para amanhã às 10h!',
      time: '12:30',
    },
  ];

  const quickReplies = [
    'Olá! Tudo bem?',
    'Confirmo seu agendamento',
    'Por favor, chegue 10 min antes',
  ];

  return (
    <div className="h-[calc(100vh-8rem)] pb-20 md:pb-6">
      <div className="grid lg:grid-cols-[350px_1fr] h-full gap-4">
        {/* Conversations List */}
        <Card className="overflow-hidden">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Buscar conversas..." className="pl-10" />
            </div>
          </div>
          <div className="overflow-y-auto h-[calc(100%-80px)]">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv.id)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedConversation === conv.id ? 'bg-pink-50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={conv.customer.avatar || undefined} />
                      <AvatarFallback className="bg-purple-100 text-purple-700">
                        {conv.customer.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {conv.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-semibold text-gray-900 truncate">
                        {conv.customer.name}
                      </p>
                      <span className="text-xs text-gray-500">{conv.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {conv.lastMessage}
                    </p>
                  </div>
                  {conv.unread > 0 && (
                    <Badge className="bg-pink-500 hover:bg-pink-600">
                      {conv.unread}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Chat Window */}
        {selectedConversation ? (
          <Card className="flex flex-col overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-purple-100 text-purple-700">
                    MS
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">Maria Silva</p>
                  <p className="text-xs text-green-600">Online</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === 'me' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      msg.sender === 'me'
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.sender === 'me' ? 'text-pink-100' : 'text-gray-500'
                      }`}
                    >
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Replies */}
            <div className="px-4 py-2 border-t bg-gray-50">
              <div className="flex gap-2 overflow-x-auto">
                {quickReplies.map((reply, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    className="whitespace-nowrap"
                    onClick={() => setMessage(reply)}
                  >
                    {reply}
                  </Button>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Digite sua mensagem..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      // Send message logic
                      setMessage('');
                    }
                  }}
                />
                <Button className="bg-pink-500 hover:bg-pink-600">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="flex items-center justify-center h-full">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Selecione uma conversa para começar</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
