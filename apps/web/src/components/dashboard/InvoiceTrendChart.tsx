'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Payload } from 'recharts/types/component/DefaultTooltipContent';
import { useInvoiceTrends } from '@/hooks/useInvoiceTrends';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { EmptyState } from '../shared/EmptyState';
import { formatCurrency, formatMonth } from '@/lib/formatters';

type InvoiceTrendChartData = {
  month: string;
  invoices: number;
  amount: number;
};

export function InvoiceTrendChart() {
  const { data, loading, error } = useInvoiceTrends();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Invoice Volume & Value Trend
        </h3>
        <div className="h-80 flex items-center justify-center">
          <LoadingSpinner text="Loading chart data..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Invoice Volume & Value Trend
        </h3>
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!data || data.trends.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Invoice Volume & Value Trend
        </h3>
        <EmptyState
          title="No trend data"
          description="No invoice trends available to display"
        />
      </div>
    );
  }

  const chartData: InvoiceTrendChartData[] = data.trends.map((trend) => ({
    month: formatMonth(trend.date),
    invoices: trend.invoiceCount,
    amount: trend.totalAmount,
  }));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Invoice Volume & Value Trend
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Monthly invoice count and total amount over time
        </p>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="month"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis
            yAxisId="left"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickLine={{ stroke: '#e5e7eb' }}
            label={{
              value: 'Invoice Count',
              angle: -90,
              position: 'insideLeft',
              style: { fill: '#6b7280', fontSize: 12 },
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickLine={{ stroke: '#e5e7eb' }}
            tickFormatter={(value: number) => `$${(value / 1000).toFixed(0)}K`}
            label={{
              value: 'Total Amount',
              angle: 90,
              position: 'insideRight',
              style: { fill: '#6b7280', fontSize: 12 },
            }}
          />

          {/* ✅ FIX: Formatter typed with Payload instead of any */}
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px',
            }}
            formatter={(
              value: number,
              name: string,
              item?: Payload<number, string>
            ) => {
              if (name === 'amount') {
                return [formatCurrency(value), 'Total Amount'];
              }
              return [value, 'Invoice Count'];
            }}
          />

          <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />

          <Line
            yAxisId="left"
            type="monotone"
            dataKey="invoices"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
            name="Invoice Count"
          />

          <Line
            yAxisId="right"
            type="monotone"
            dataKey="amount"
            stroke="#8b5cf6"
            strokeWidth={2}
            dot={{ fill: '#8b5cf6', r: 4 }}
            activeDot={{ r: 6 }}
            name="Total Amount"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}