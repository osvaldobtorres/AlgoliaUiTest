export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  detailedDescription: string;
  color: string;
}

export interface SubCategory {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  icon: string;
}

export interface InvestmentProduct {
  id: string;
  name: string;
  description: string;
  type: string;
  risk: 'low' | 'medium' | 'high';
  expectedReturn: string;
  minimumAmount: number;
  category: string;
  subCategoryId: string;
  profileImage?: string;
  ticker?: string;
}

export interface CategoryRow {
  id: string;
  title: string;
  products: InvestmentProduct[];
}