'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useCashOutflow } from '@/hooks/useCashOutflow';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { EmptyState } from '../shared/EmptyState';
import { formatCurrency, formatShortDate } from '@/lib/formatters';

export function CashOutflowChart() {
  const { data, loading, error } = useCashOutflow();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Cash Outflow Forecast
        </h3>
        <div className="h-80 flex items-center justify-center">
          <LoadingSpinner text="Loading forecast data..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Cash Outflow Forecast
        </h3>
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!data || data.outflows.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Cash Outflow Forecast
        </h3>
        <EmptyState title="No forecast data" description="No cash outflow forecast available" />
      </div>
    );
  }

  const chartData = data.outflows.map((outflow) => ({
    date: formatShortDate(outflow.date),
    fullDate: outflow.date,
    amount: outflow.amount,
    count: outflow.invoiceCount,
  }));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Cash Outflow Forecast
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Expected cash outflow based on due dates
        </p>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickLine={{ stroke: '#e5e7eb' }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px',
            }}
            formatter={(value: number, name: string) => {
              if (name === 'amount') {
                return [formatCurrency(value), 'Expected Outflow'];
              }
              return [value, 'Invoice Count'];
            }}
            labelFormatter={(label, payload) => {
              return payload && payload[0] ? `Due: ${formatShortDate(payload[0].payload.fullDate)}` : label;
            }}
          />
          <Bar
            dataKey="amount"
            fill="#8b5cf6"
            radius={[8, 8, 0, 0]}
            barSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 flex items-center justify-center gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-purple-600"></div>
          <span>Expected Cash Outflow</span>
        </div>
      </div>
    </div>
  );
}