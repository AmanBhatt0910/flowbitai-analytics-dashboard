'use client';

import React, { useRef, useEffect } from 'react';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import { useChat } from '@/hooks/useChat';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { MessageSquare, Sparkles } from 'lucide-react';

const SAMPLE_QUERIES = [
  "What's the total spend in the last 90 days?",
  "List top 5 vendors by spend",
  "Show overdue invoices as of today",
  "What's the average invoice value by category?",
];

export function ChatInterface() {
  const { messages, loading, sendMessage, clearMessages } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Chat with Your Data
            </h3>
            <p className="text-sm text-gray-600">
              Ask questions in natural language
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearMessages}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Clear Chat
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-6">
              <Sparkles className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Start a Conversation
            </h3>
            <p className="text-gray-600 mb-8 text-center max-w-md">
              Ask questions about your invoices, vendors, spending patterns, and more.
              I&apos;ll generate SQL queries and show you the results.
            </p>

            <div className="w-full max-w-2xl">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Try these sample queries:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SAMPLE_QUERIES.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => sendMessage(query)}
                    className="p-4 text-left bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all group"
                  >
                    <p className="text-sm text-gray-700 group-hover:text-blue-600">
                      {query}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {loading && (
              <div className="flex gap-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <LoadingSpinner size="sm" />
                </div>
                <div className="flex-1">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Thinking...</p>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <ChatInput onSend={sendMessage} disabled={loading} />
    </div>
  );
}