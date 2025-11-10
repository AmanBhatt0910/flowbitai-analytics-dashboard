'use client';

import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Filter,
  Download,
} from 'lucide-react';
import { useInvoices } from '@/hooks/useInvoices';
import { SearchBar } from '../shared/SearchBar';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatCurrency, formatDate } from '@/lib/formatters';
import type { Invoice } from '@/types';
import { cn } from '@/lib/utils';
import { INVOICE_STATUS_COLORS } from '@/lib/constants';

type SortField = 'invoiceDate' | 'amount' | 'vendorName' | 'status';
type SortDirection = 'asc' | 'desc';

const SortIcon = ({
  field,
  sortField,
  sortDirection,
}: {
  field: SortField;
  sortField: SortField;
  sortDirection: SortDirection;
}) => {
  if (sortField !== field) {
    return <ChevronsUpDown className="h-4 w-4 text-gray-400" />;
  }
  return sortDirection === 'asc' ? (
    <ChevronUp className="h-4 w-4 text-blue-600" />
  ) : (
    <ChevronDown className="h-4 w-4 text-blue-600" />
  );
};

export function InvoicesTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('invoiceDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, loading, error, updateFilters } = useInvoices({
    page: currentPage,
    limit: 10,
  });

  // Search filter
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    updateFilters({
      search: query || undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      page: 1,
      limit: 10,
    });
  };

  // Status filter
  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
    updateFilters({
      search: searchQuery || undefined,
      status: status !== 'all' ? status : undefined,
      page: 1,
      limit: 10,
    });
  };

  // Sorting
  const handleSort = (field: SortField) => {
    const newDirection =
      sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
  };

  // Pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateFilters({
      search: searchQuery || undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      page,
      limit: 10,
    });
  };

  /**
   * ✅ Memoization fixed — dependency matches inference
   */
  const sortedInvoices = useMemo(() => {
    const invoices = data?.invoices ?? [];

    return invoices.slice().sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'invoiceDate':
          comparison =
            new Date(a.invoiceDate).getTime() -
            new Date(b.invoiceDate).getTime();
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'vendorName':
          comparison = a.vendorName.localeCompare(b.vendorName);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data?.invoices, sortField, sortDirection]); // ✅ correct deps

  // Loading state
  if (loading && !data) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoices</h3>
        <div className="h-96 flex items-center justify-center">
          <LoadingSpinner text="Loading invoices..." />
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoices</h3>
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Invoices</h3>
            <p className="text-sm text-gray-600 mt-1">
              {data?.total || 0} total invoices
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <SearchBar
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search by vendor, invoice number..."
            className="flex-1"
          />

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {/* ✅ sorted icons work */}
              <th
                onClick={() => handleSort('invoiceDate')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  Date
                  <SortIcon
                    field="invoiceDate"
                    sortField={sortField}
                    sortDirection={sortDirection}
                  />
                </div>
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invoice #
              </th>

              <th
                onClick={() => handleSort('vendorName')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  Vendor
                  <SortIcon
                    field="vendorName"
                    sortField={sortField}
                    sortDirection={sortDirection}
                  />
                </div>
              </th>

              <th
                onClick={() => handleSort('amount')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  Amount
                  <SortIcon
                    field="amount"
                    sortField={sortField}
                    sortDirection={sortDirection}
                  />
                </div>
              </th>

              <th
                onClick={() => handleSort('status')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  Status
                  <SortIcon
                    field="status"
                    sortField={sortField}
                    sortDirection={sortDirection}
                  />
                </div>
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {sortedInvoices.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12">
                  <EmptyState
                    title="No invoices found"
                    description="Try adjusting your search or filters"
                  />
                </td>
              </tr>
            ) : (
              sortedInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(invoice.invoiceDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {invoice.invoiceNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {invoice.vendorName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(invoice.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={cn(
                        'px-3 py-1 rounded-full text-xs font-medium',
                        INVOICE_STATUS_COLORS[invoice.status]
                      )}
                    >
                      {invoice.status.charAt(0).toUpperCase() +
                        invoice.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Showing{' '}
            <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(currentPage * 10, data.total)}
            </span>{' '}
            of <span className="font-medium">{data.total}</span> results
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            {Array.from({ length: data.totalPages }, (_, i) => i + 1)
              .filter((page) => {
                return (
                  page === 1 ||
                  page === data.totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                );
              })
              .map((page, index, pages) => (
                <React.Fragment key={page}>
                  {index > 0 && pages[index - 1] !== page - 1 && (
                    <span className="px-3 py-2 text-gray-500">...</span>
                  )}
                  <button
                    onClick={() => handlePageChange(page)}
                    className={cn(
                      'px-4 py-2 border rounded-lg text-sm font-medium transition-colors',
                      currentPage === page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    {page}
                  </button>
                </React.Fragment>
              ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === data.totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}