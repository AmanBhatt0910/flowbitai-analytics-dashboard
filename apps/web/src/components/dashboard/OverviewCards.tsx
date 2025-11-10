'use client';

import React from 'react';
import { DollarSign, FileText, Upload, TrendingUp } from 'lucide-react';
import { StatCard } from './StatCard';
import { useStats } from '@/hooks/useStats';
import { formatCurrency, formatNumber } from '@/lib/formatters';
import { ErrorMessage } from '@/components/shared/ErrorMessage';

export function OverviewCards() {
  const { data, loading, error } = useStats();

  if (error) {
    return (
      <div className="col-span-4">
        <ErrorMessage message={error} />
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Spend (YTD)',
      value: data ? formatCurrency(data.totalSpend) : '$0',
      icon: DollarSign,
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-100',
      description: 'Year to date expenditure',
    },
    {
      title: 'Total Invoices Processed',
      value: data ? formatNumber(data.totalInvoices) : '0',
      icon: FileText,
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-100',
      description: 'Successfully processed',
    },
    {
      title: 'Documents Uploaded',
      value: data ? formatNumber(data.documentsUploaded) : '0',
      icon: Upload,
      iconColor: 'text-purple-600',
      iconBgColor: 'bg-purple-100',
      description: 'Total documents in system',
    },
    {
      title: 'Average Invoice Value',
      value: data ? formatCurrency(data.averageInvoiceValue) : '$0',
      icon: TrendingUp,
      iconColor: 'text-orange-600',
      iconBgColor: 'bg-orange-100',
      description: 'Mean transaction amount',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          iconColor={stat.iconColor}
          iconBgColor={stat.iconBgColor}
          loading={loading}
          description={stat.description}
        />
      ))}
    </div>
  );
}
