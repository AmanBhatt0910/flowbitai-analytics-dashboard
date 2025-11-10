export interface CashOutflow {
  date: string;
  amount: number;
  invoiceCount: number;
}

export interface CashOutflowResponse {
  outflows: CashOutflow[];
}