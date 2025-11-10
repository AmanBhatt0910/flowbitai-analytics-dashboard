// src/lib/constants.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001/api';
export const APP_NAME = 'Flowbit Analytics';
export const ITEMS_PER_PAGE = 10;

export const INVOICE_STATUS = {
  PAID: 'paid',
  PENDING: 'pending',
  OVERDUE: 'overdue',
} as const;

export const INVOICE_STATUS_COLORS: Record<string, string> = {
  paid: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  overdue: 'bg-red-100 text-red-800',
};

export const CHART_COLORS = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
};