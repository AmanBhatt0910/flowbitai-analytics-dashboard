'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieLabelRenderProps,
} from 'recharts';
import { Payload } from 'recharts/types/component/DefaultTooltipContent';
import { useCategorySpend } from '@/hooks/useCategorySpend';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatCurrency } from '@/lib/formatters';
import { pieChartColors as COLORS } from '@/config/charts';

type CategoryChartData = {
  name: string;
  value: number;
  percentage: number;
};

export function CategoryPieChart() {
  const { data, loading, error } = useCategorySpend();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Spend by Category</h3>
        <div className="h-80 flex items-center justify-center">
          <LoadingSpinner text="Loading category data..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Spend by Category</h3>
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!data || data.categories.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Spend by Category</h3>
        <EmptyState
          title="No category data"
          description="No spending by category available"
        />
      </div>
    );
  }

  const chartData: CategoryChartData[] = data.categories.map((cat) => ({
    name: cat.category,
    value: cat.totalSpend,
    percentage: cat.percentage,
  }));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Spend by Category</h3>
        <p className="text-sm text-gray-600 mt-1">
          Distribution of spending across categories
        </p>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            labelLine={false}
            label={(props: PieLabelRenderProps) => {
            const { name, percent } = props;
            const numericPercent = Number(percent ?? 0);
            return `${name}: ${(numericPercent * 100).toFixed(1)}%`;
          }}
          >
            {chartData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px',
            }}
            formatter={(
              value: number,
              _name: string,
              item?: Payload<number, string>
            ) => {
              const percentage = item?.payload?.percentage ?? 0;
              return [
                `${formatCurrency(value)} (${percentage.toFixed(1)}%)`,
                'Total Spend',
              ];
            }}
          />

          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}