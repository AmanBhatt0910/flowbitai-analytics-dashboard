export interface CategorySpend {
  category: string;
  totalSpend: number;
  percentage: number;
}

export interface CategorySpendResponse {
  categories: CategorySpend[];
}