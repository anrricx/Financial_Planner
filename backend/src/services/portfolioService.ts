import { InvestmentInput, Allocation, YearlyProjection, PortfolioResult } from '../../../shared/types';

class PortfolioService {
  // Default expected returns by risk level (annual percentage)
  private readonly DEFAULT_RETURNS = {
    Low: 0.04,        // 4% annual return
    Moderate: 0.07,   // 7% annual return
    High: 0.12        // 12% annual return
  };

  // Portfolio allocation strategies by risk level
  private readonly ALLOCATION_STRATEGIES = {
    Low: [
      { category: 'Bonds', percentage: 0.60 },
      { category: 'Index Funds', percentage: 0.40 }
    ],
    Moderate: [
      { category: 'Index Funds', percentage: 0.40 },
      { category: 'Tech Stocks', percentage: 0.35 },
      { category: 'Value Stocks', percentage: 0.25 }
    ],
    High: [
      { category: 'Tech Stocks', percentage: 0.45 },
      { category: 'Growth Stocks', percentage: 0.35 },
      { category: 'Emerging Markets', percentage: 0.20 }
    ]
  };

  calculatePortfolio(input: InvestmentInput): PortfolioResult {
    // Convert percentage to decimal if provided, otherwise use default
    const expectedReturnPercent = input.expectedReturn ?? (this.DEFAULT_RETURNS[input.riskLevel] * 100);
    const expectedReturn = expectedReturnPercent / 100; // Convert percentage to decimal
    const allocationStrategy = this.ALLOCATION_STRATEGIES[input.riskLevel];
    
    // Calculate initial allocations
    const initialAllocations: Allocation[] = allocationStrategy.map(strategy => ({
      category: strategy.category,
      percentage: strategy.percentage,
      dollarAmount: input.investmentAmount * strategy.percentage
    }));

    // Calculate yearly projections
    const yearlyProjections: YearlyProjection[] = [];
    const yearsToProject = [1, 2, 5, 10].filter(year => year <= input.timeline);
    
    yearsToProject.forEach(year => {
      const totalValue = this.calculateCompoundGrowth(input.investmentAmount, expectedReturn, year);
      
      const allocations: Allocation[] = allocationStrategy.map(strategy => ({
        category: strategy.category,
        percentage: strategy.percentage,
        dollarAmount: totalValue * strategy.percentage
      }));
      
      yearlyProjections.push({
        year,
        totalValue,
        allocations
      });
    });

    return {
      initialAllocations,
      yearlyProjections
    };
  }

  /**
   * Calculate compound growth: A = P(1 + r)^t
   * where P = principal, r = annual rate, t = years
   */
  private calculateCompoundGrowth(principal: number, annualRate: number, years: number): number {
    return principal * Math.pow(1 + annualRate, years);
  }
}

export const portfolioService = new PortfolioService();

