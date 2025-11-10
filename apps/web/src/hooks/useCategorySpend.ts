'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { CategorySpendResponse } from '@/types';

export function useCategorySpend() {
  const [data, setData] = useState<CategorySpendResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const result = await api.getCategorySpend();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch category spend');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, loading, error };
}