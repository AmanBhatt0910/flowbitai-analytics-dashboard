'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { CashOutflowResponse } from '@/types';

export function useCashOutflow() {
  const [data, setData] = useState<CashOutflowResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const result = await api.getCashOutflow();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch cash outflow');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, loading, error };
}