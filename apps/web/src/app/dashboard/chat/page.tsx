'use client';

import { Header } from '@/components/layout/Header';
import { ChatInterface } from '@/components/chat/ChatInterface';

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Chat with Data"
        description="Ask questions about your data in natural language"
      />

      <div className="p-8">
        <ChatInterface />
      </div>
    </div>
  );
}