import { useState } from 'react';
import { NavBar } from './components/NavBar';
import { SideNav } from './components/SideNav';
import { InvestmentForm } from './components/InvestmentForm';
import { ResultsDashboard } from './components/ResultsDashboard';

interface PlanResult {
  allocations: Array<{
    ticker: string;
    percentage: number;
    dollarAmount: number;
  }>;
  expectedReturns: {
    1: number;
    2: number;
    5: number;
    10: number;
  };
  monthlyContribution?: {
    finalValue: number;
    totalContributions: number;
    totalGrowth: number;
    yearlyProjections: Array<{
      year: number;
      value: number;
      contributions: number;
      growth: number;
    }>;
  };
}

function App() {
  const [result, setResult] = useState<PlanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (formData: { 
    amount: number; 
    riskScore: number;
    monthlyContribution?: number;
    expectedReturn?: number;
    timeHorizon?: number;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate plan');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-fidelity-gray-light">
      <NavBar />

      {/* Layout with SideNav and Main Content */}
      <div className="flex">
        <SideNav />
        
        {/* Main Content */}
        <main className="flex-1 px-8 py-10">
          {!result ? (
            <div className="max-w-3xl">
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-fidelity-gray-dark mb-3">
                  Investment Portfolio Planner
                </h1>
                <p className="text-lg text-fidelity-gray-medium">
                  Create a personalized investment plan based on your risk tolerance and investment amount.
                </p>
              </div>
              <InvestmentForm onSubmit={handleFormSubmit} loading={loading} />
              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700">
                  {error}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="mb-8">
                <button
                  onClick={() => setResult(null)}
                  className="text-fidelity-green hover:text-fidelity-green-dark font-medium flex items-center gap-2 mb-6"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Planning
                </button>
                <h1 className="text-4xl font-bold text-fidelity-gray-dark mb-3">
                  Portfolio Analysis
                </h1>
                <p className="text-lg text-fidelity-gray-medium">
                  Review your portfolio allocations and projected returns.
                </p>
              </div>
              <ResultsDashboard 
                allocations={result.allocations}
                expectedReturns={result.expectedReturns}
                monthlyContribution={result.monthlyContribution}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;

