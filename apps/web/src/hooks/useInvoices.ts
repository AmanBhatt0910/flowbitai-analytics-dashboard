'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { InvoicesResponse, InvoiceFilters } from '@/types';

export function useInvoices(initialFilters?: InvoiceFilters) {
  const [data, setData] = useState<InvoicesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<InvoiceFilters>(initialFilters || {});

  const fetchInvoices = useCallback(async (newFilters?: InvoiceFilters) => {
    try {
      setLoading(true);
      const filtersToUse = newFilters || filters;
      const result = await api.getInvoices(filtersToUse);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchInvoices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateFilters = useCallback((newFilters: InvoiceFilters) => {
    setFilters(newFilters);
    fetchInvoices(newFilters);
  }, [fetchInvoices]);

  const refresh = useCallback(() => {
    fetchInvoices(filters);
  }, [fetchInvoices, filters]);

  return { data, loading, error, filters, updateFilters, refresh };
}