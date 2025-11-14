export interface TickerAllocation {
  ticker: string;
  percentage: number;
  dollarAmount: number;
}

type RiskLevel = 'low' | 'moderate' | 'high';

class AllocationService {
  // Portfolio allocation strategies by risk level with ticker symbols
  private readonly ALLOCATION_STRATEGIES: Record<RiskLevel, Array<{ ticker: string; percentage: number }>> = {
    low: [
      { ticker: 'SCHD', percentage: 0.60 },
      { ticker: 'BND', percentage: 0.20 },
      { ticker: 'VOO', percentage: 0.20 }
    ],
    moderate: [
      { ticker: 'VOO', percentage: 0.40 },
      { ticker: 'QQQ', percentage: 0.30 },
      { ticker: 'SCHD', percentage: 0.20 },
      { ticker: 'VXUS', percentage: 0.10 }
    ],
    high: [
      { ticker: 'QQQ', percentage: 0.50 },
      { ticker: 'ARKK', percentage: 0.30 },
      { ticker: 'VOO', percentage: 0.20 }
    ]
  };

  /**
   * Get portfolio allocation based on investment amount and risk level
   * @param amount - Total investment amount in dollars
   * @param risk - Risk level: "low", "moderate", or "high"
   * @returns Array of ticker allocations with percentage and dollar amounts
   */
  getPortfolioAllocation(amount: number, risk: RiskLevel): TickerAllocation[] {
    const allocationStrategy = this.ALLOCATION_STRATEGIES[risk.toLowerCase() as RiskLevel];
    
    if (!allocationStrategy) {
      throw new Error(`Invalid risk level: ${risk}. Must be "low", "moderate", or "high"`);
    }

    return allocationStrategy.map(strategy => ({
      ticker: strategy.ticker,
      percentage: strategy.percentage,
      dollarAmount: amount * strategy.percentage
    }));
  }
}

export const allocationService = new AllocationService();

