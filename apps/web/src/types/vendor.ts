export interface Vendor {
  id: string;
  name: string;
  totalSpend: number;
  invoiceCount: number;
}

export interface VendorSpendData {
  vendors: Vendor[];
}