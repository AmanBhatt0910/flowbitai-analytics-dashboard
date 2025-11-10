export interface InvoiceTrend {
  month: string;
  date: string;
  invoiceCount: number;
  totalAmount: number;
}

export interface InvoiceTrendsResponse {
  trends: InvoiceTrend[];
}