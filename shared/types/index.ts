export interface InvestmentInput {
  investmentAmount: number;
  riskLevel: 'Low' | 'Moderate' | 'High';
  expectedReturn?: number; // Optional, will default based on risk level
  timeline: 1 | 2 | 5 | 10;
  preferredSectors?: string[];
}

export interface Allocation {
  category: string;
  percentage: number;
  dollarAmount: number;
}

export interface YearlyProjection {
  year: number;
  totalValue: number;
  allocations: Allocation[];
}

export interface PortfolioResult {
  initialAllocations: Allocation[];
  yearlyProjections: YearlyProjection[];
}

