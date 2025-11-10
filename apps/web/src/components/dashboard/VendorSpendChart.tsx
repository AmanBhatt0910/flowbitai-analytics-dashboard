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
import { useVendors } from '@/hooks/useVendors';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { EmptyState } from '../shared/EmptyState';
import { formatCurrency, truncateText } from '@/lib/formatters';

type VendorChartData = {
  name: string;
  fullName: string;
  spend: number;
  invoiceCount: number;
};

export function VendorSpendChart() {
  const { data, loading, error } = useVendors();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Top 10 Vendors by Spend
        </h3>
        <div className="h-80 flex items-center justify-center">
          <LoadingSpinner text="Loading vendor data..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Top 10 Vendors by Spend
        </h3>
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!data || data.vendors.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Top 10 Vendors by Spend
        </h3>
        <EmptyState title="No vendor data" description="No vendor spending data available" />
      </div>
    );
  }

  const chartData: VendorChartData[] = data.vendors
    .sort((a, b) => b.totalSpend - a.totalSpend)
    .slice(0, 10)
    .map((vendor) => ({
      name: truncateText(vendor.name, 20),
      fullName: vendor.name,
      spend: vendor.totalSpend,
      invoiceCount: vendor.invoiceCount,
    }));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Top 10 Vendors by Spend</h3>
        <p className="text-sm text-gray-600 mt-1">Highest spending vendors in descending order</p>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 120 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

          <XAxis
            type="number"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickLine={{ stroke: '#e5e7eb' }}
            tickFormatter={(value: number) => `$${(value / 1000).toFixed(0)}K`}
          />

          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickLine={{ stroke: '#e5e7eb' }}
            width={110}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px',
            }}
            formatter={(
              value: number,
              name: string
            ) => {
              if (name === 'spend') {
                return [formatCurrency(value), 'Total Spend'];
              }
              return [value, name];
            }}
            labelFormatter={(_, payload) => {
              const full = (payload?.[0]?.payload as VendorChartData)?.fullName;
              return full ?? '';
            }}
          />

          <Bar dataKey="spend" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}