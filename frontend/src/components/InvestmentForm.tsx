import { useState, FormEvent } from 'react';

interface InvestmentFormProps {
  onSubmit: (data: { 
    amount: number; 
    riskScore: number;
    monthlyContribution?: number;
    expectedReturn?: number;
    timeHorizon?: number;
  }) => void;
  loading?: boolean;
}

export function InvestmentForm({ onSubmit, loading = false }: InvestmentFormProps) {
  const [amount, setAmount] = useState<number>(10000);
  const [riskScore, setRiskScore] = useState<number>(5);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(0);
  const [expectedReturn, setExpectedReturn] = useState<number>(7);
  const [timeHorizon, setTimeHorizon] = useState<number>(10);

  const getRiskLabel = (score: number): string => {
    if (score <= 3) return 'Ultra Conservative';
    if (score <= 7) return 'Moderate';
    return 'Aggressive';
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ 
      amount, 
      riskScore,
      monthlyContribution: monthlyContribution > 0 ? monthlyContribution : undefined,
      expectedReturn: monthlyContribution > 0 ? expectedReturn : undefined,
      timeHorizon: monthlyContribution > 0 ? timeHorizon : undefined,
    });
  };

  return (
    <div className="bg-white border border-fidelity shadow-fidelity p-8">
      <h2 className="text-2xl font-bold text-fidelity-gray-dark mb-2">
        Investment Details
      </h2>
      <p className="text-fidelity-gray-medium mb-8">
        Enter your investment amount and select your risk tolerance level.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label 
            htmlFor="amount" 
            className="block text-sm font-medium text-fidelity-gray-medium mb-3"
          >
            Investment Amount ($)
          </label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value) || 0)}
            className="w-full px-4 py-3 border border-fidelity-input focus:ring-2 focus:ring-fidelity-green focus:border-fidelity-green outline-none text-fidelity-gray-dark"
            placeholder="Enter amount"
            step="1"
            min="0"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label 
              htmlFor="riskScore" 
              className="block text-sm font-medium text-fidelity-gray-medium"
            >
              Risk Tolerance
            </label>
            <div className="text-right">
              <div className="text-2xl font-bold text-fidelity-green">{riskScore}</div>
              <div className="text-xs text-fidelity-gray-medium">{getRiskLabel(riskScore)}</div>
            </div>
          </div>
          <input
            id="riskScore"
            type="range"
            min="1"
            max="10"
            step="1"
            value={riskScore}
            onChange={(e) => setRiskScore(Number(e.target.value))}
            className="w-full appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #007A33 0%, #007A33 ${((riskScore - 1) / 9) * 100}%, #E0E0E0 ${((riskScore - 1) / 9) * 100}%, #E0E0E0 100%)`
            }}
          />
          <div className="flex justify-between mt-2 text-xs text-fidelity-gray-medium">
            <span>1 - Ultra Conservative</span>
            <span>10 - Aggressive</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-fidelity-green text-white py-3.5 px-8 font-semibold hover:bg-fidelity-green-dark focus:outline-none focus:ring-2 focus:ring-fidelity-green focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Generating Plan...' : 'Generate Plan'}
        </button>
      </form>

      {/* Monthly Contribution Card */}
      <div className="bg-white border border-fidelity shadow-fidelity p-8 mt-8">
        <h2 className="text-2xl font-bold text-fidelity-gray-dark mb-2">
          Monthly Contribution
        </h2>
        <p className="text-fidelity-gray-medium mb-8">
          Calculate future value with regular monthly contributions.
        </p>
        
        <form className="space-y-8">
          <div>
            <label 
              htmlFor="monthlyContribution" 
              className="block text-sm font-medium text-fidelity-gray-medium mb-3"
            >
              Monthly Contribution Amount ($)
            </label>
            <input
              id="monthlyContribution"
              type="number"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(Number(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-fidelity-input focus:ring-2 focus:ring-fidelity-green focus:border-fidelity-green outline-none text-fidelity-gray-dark"
              placeholder="Enter monthly amount"
              step="1"
              min="0"
            />
          </div>

          <div>
            <label 
              htmlFor="expectedReturn" 
              className="block text-sm font-medium text-fidelity-gray-medium mb-3"
            >
              Expected Annual Return (%)
            </label>
            <input
              id="expectedReturn"
              type="number"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(Number(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-fidelity-input focus:ring-2 focus:ring-fidelity-green focus:border-fidelity-green outline-none text-fidelity-gray-dark"
              placeholder="Enter expected return"
              step="0.1"
              min="0"
              max="100"
            />
          </div>

          <div>
            <label 
              htmlFor="timeHorizon" 
              className="block text-sm font-medium text-fidelity-gray-medium mb-3"
            >
              Investment Time Horizon (Years)
            </label>
            <input
              id="timeHorizon"
              type="number"
              value={timeHorizon}
              onChange={(e) => setTimeHorizon(Number(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-fidelity-input focus:ring-2 focus:ring-fidelity-green focus:border-fidelity-green outline-none text-fidelity-gray-dark"
              placeholder="Enter years"
              step="1"
              min="1"
              max="50"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

