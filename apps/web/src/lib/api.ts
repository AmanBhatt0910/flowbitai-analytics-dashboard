import {
  OverviewStats,
  InvoiceTrendsResponse,
  VendorSpendData,
  CategorySpendResponse,
  CashOutflowResponse,
  InvoicesResponse,
  InvoiceFilters,
  ChatRequest,
  ChatResponse,
} from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001/api';

class ApiClient {
  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  async getStats(): Promise<OverviewStats> {
    return this.fetch<OverviewStats>('/stats');
  }

  async getInvoiceTrends(): Promise<InvoiceTrendsResponse> {
    return this.fetch<InvoiceTrendsResponse>('/invoice-trends');
  }

  async getTopVendors(): Promise<VendorSpendData> {
    return this.fetch<VendorSpendData>('/vendors/top10');
  }

  async getCategorySpend(): Promise<CategorySpendResponse> {
    return this.fetch<CategorySpendResponse>('/category-spend');
  }

  async getCashOutflow(): Promise<CashOutflowResponse> {
    return this.fetch<CashOutflowResponse>('/cash-outflow');
  }

  async getInvoices(filters?: InvoiceFilters): Promise<InvoicesResponse> {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.vendorId) params.append('vendorId', filters.vendorId);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const endpoint = `/invoices${queryString ? `?${queryString}` : ''}`;
    
    return this.fetch<InvoicesResponse>(endpoint);
  }

  async chatWithData(request: ChatRequest): Promise<ChatResponse> {
    return this.fetch<ChatResponse>('/chat-with-data', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }
}

export const api = new ApiClient();