'use client';

import React from 'react';
import { User, Bot } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '@/types';
import { formatDate } from '@/lib/formatters';
import { SQLDisplay } from './SQLDisplay';
import { ResultsTable } from './ResultsTable';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-gradient-to-br from-blue-500 to-purple-600'
            : 'bg-gray-200'
        }`}
      >
        {isUser ? (
          <User className="h-5 w-5 text-white" />
        ) : (
          <Bot className="h-5 w-5 text-gray-700" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div
          className={`max-w-3xl rounded-lg p-4 ${
            isUser
              ? 'bg-blue-600 text-white ml-auto'
              : 'bg-white border border-gray-200 shadow-sm'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* SQL Display */}
        {message.sql && !isUser && (
          <div className="mt-3 max-w-3xl">
            <SQLDisplay sql={message.sql} />
          </div>
        )}

        {/* Results Table */}
        {message.results && message.results.length > 0 && !isUser && (
          <div className="mt-3 max-w-3xl w-full">
            <ResultsTable data={message.results} />
          </div>
        )}

        {/* Error Display */}
        {message.error && !isUser && (
          <div className="mt-3 max-w-3xl p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">
              <span className="font-medium">Error:</span> {message.error}
            </p>
          </div>
        )}

        <p className="text-xs text-gray-500 mt-2">
          {formatDate(message.timestamp.toISOString())} at{' '}
          {message.timestamp.toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}