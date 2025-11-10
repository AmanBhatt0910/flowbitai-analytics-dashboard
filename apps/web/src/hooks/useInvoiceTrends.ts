'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { InvoiceTrendsResponse } from '@/types';

export function useInvoiceTrends() {
  const [data, setData] = useState<InvoiceTrendsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const result = await api.getInvoiceTrends();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch trends');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, loading, error };
}
