'use client';

import { Header } from '@/components/layout/Header';
import { OverviewCards } from '@/components/dashboard/OverviewCards';
import { InvoiceTrendChart } from '@/components/dashboard/InvoiceTrendChart';
import { VendorSpendChart } from '@/components/dashboard/VendorSpendChart';
import { CategoryPieChart } from '@/components/dashboard/CategoryPieChart';
import { CashOutflowChart } from '@/components/dashboard/CashOutflowChart';
import { InvoicesTable } from '@/components/dashboard/InvoicesTable';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Analytics Dashboard"
        description="Real-time insights into your invoice and spending data"
      />

      <div className="p-8 space-y-8">
        {/* Overview Cards */}
        <OverviewCards />

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InvoiceTrendChart />
          <VendorSpendChart />
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategoryPieChart />
          <CashOutflowChart />
        </div>

        {/* Invoices Table */}
        <InvoicesTable />
      </div>
    </div>
  );
}