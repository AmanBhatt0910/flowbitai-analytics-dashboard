export type QueryResultRow = Record<string, unknown>;

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sql?: string;
  results?: QueryResultRow[];
  error?: string;
}

export interface ChatRequest {
  query: string;
  conversationHistory?: ChatMessage[];
}

export interface ChatResponse {
  response: string;
  sql?: string;
  results?: QueryResultRow[];
  error?: string;
}