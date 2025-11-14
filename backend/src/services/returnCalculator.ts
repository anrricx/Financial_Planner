export interface YearlyProjections {
  '1yr': number;
  '2yr': number;
  '5yr': number;
  '10yr': number;
}

// Expected annual returns per asset (as decimals)
export const EXPECTED_RETURNS: Record<string, number> = {
  VOO: 0.09,   // 9%
  QQQ: 0.12,   // 12%
  SCHD: 0.08,  // 8%
  BND: 0.04,   // 4%
  VXUS: 0.07,  // 7%
  ARKK: 0.15   // 15%
};

class ReturnCalculator {
  /**
   * Calculate future value using compound interest formula
   * FV = principal * (1 + rate)^years
   * @param principal - Initial investment amount
   * @param annualReturnRate - Annual return rate as a decimal (e.g., 0.09 for 9%)
   * @param years - Number of years
   * @returns Future value after compound growth
   */
  calculateFutureValue(principal: number, annualReturnRate: number, years: number): number {
    if (principal < 0) {
      throw new Error('Principal must be non-negative');
    }
    if (years < 0) {
      throw new Error('Years must be non-negative');
    }
    
    return principal * Math.pow(1 + annualReturnRate, years);
  }

  /**
   * Calculate weighted return rate from allocations
   * weightedReturnRate = Σ (percentage * expectedReturnPerAsset)
   * @param allocations - Array of allocations with ticker and percentage
   * @returns Weighted return rate as a decimal
   */
  calculateWeightedReturnRate(allocations: Array<{ ticker: string; percentage: number }>): number {
    return allocations.reduce((weightedRate, allocation) => {
      const expectedReturn = EXPECTED_RETURNS[allocation.ticker];
      
      if (expectedReturn === undefined) {
        throw new Error(`Expected return not found for ticker: ${allocation.ticker}`);
      }
      
      return weightedRate + (allocation.percentage * expectedReturn);
    }, 0);
  }

  /**
   * Get yearly projections for 1, 2, 5, and 10 years
   * @param amount - Initial investment amount
   * @param weightedReturnRate - Weighted annual return rate as a decimal
   * @returns Object with projections for 1yr, 2yr, 5yr, and 10yr
   */
  getYearlyProjections(amount: number, weightedReturnRate: number): YearlyProjections {
    if (amount < 0) {
      throw new Error('Amount must be non-negative');
    }

    return {
      '1yr': this.calculateFutureValue(amount, weightedReturnRate, 1),
      '2yr': this.calculateFutureValue(amount, weightedReturnRate, 2),
      '5yr': this.calculateFutureValue(amount, weightedReturnRate, 5),
      '10yr': this.calculateFutureValue(amount, weightedReturnRate, 10)
    };
  }

  /**
   * Calculate future value with monthly contributions
   * FV = P * (1 + r)^t + PMT * [ ((1 + r)^t - 1 ) / r ]
   * Where:
   * - P = initial principal
   * - r = monthly return rate (annual / 12)
   * - t = number of months (years * 12)
   * - PMT = monthly payment
   * @param principal - Initial investment amount
   * @param monthlyContribution - Monthly contribution amount
   * @param annualReturnRate - Annual return rate as a decimal (e.g., 0.07 for 7%)
   * @param years - Number of years
   * @returns Object with final value, total contributions, and growth over time
   */
  calculateWithMonthlyContributions(
    principal: number,
    monthlyContribution: number,
    annualReturnRate: number,
    years: number
  ): {
    finalValue: number;
    totalContributions: number;
    totalGrowth: number;
    yearlyProjections: Array<{ year: number; value: number; contributions: number; growth: number }>;
  } {
    if (principal < 0) {
      throw new Error('Principal must be non-negative');
    }
    if (monthlyContribution < 0) {
      throw new Error('Monthly contribution must be non-negative');
    }
    if (years < 0) {
      throw new Error('Years must be non-negative');
    }

    const monthlyRate = annualReturnRate / 12;
    const totalMonths = years * 12;
    const totalContributions = principal + (monthlyContribution * totalMonths);

    // Calculate final value
    const principalFV = principal * Math.pow(1 + monthlyRate, totalMonths);
    
    let annuityFV = 0;
    if (monthlyRate > 0) {
      annuityFV = monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
    } else {
      // If rate is 0, just sum the contributions
      annuityFV = monthlyContribution * totalMonths;
    }

    const finalValue = principalFV + annuityFV;
    const totalGrowth = finalValue - totalContributions;

    // Calculate yearly projections
    const yearlyProjections = [];
    for (let year = 1; year <= years; year++) {
      const months = year * 12;
      const yearPrincipalFV = principal * Math.pow(1 + monthlyRate, months);
      let yearAnnuityFV = 0;
      if (monthlyRate > 0) {
        yearAnnuityFV = monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
      } else {
        yearAnnuityFV = monthlyContribution * months;
      }
      const yearValue = yearPrincipalFV + yearAnnuityFV;
      const yearContributions = principal + (monthlyContribution * months);
      const yearGrowth = yearValue - yearContributions;
      
      yearlyProjections.push({
        year,
        value: yearValue,
        contributions: yearContributions,
        growth: yearGrowth,
      });
    }

    return {
      finalValue,
      totalContributions,
      totalGrowth,
      yearlyProjections,
    };
  }
}

export const returnCalculator = new ReturnCalculator();

