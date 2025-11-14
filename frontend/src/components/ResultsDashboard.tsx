import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

interface TickerAllocation {
  ticker: string;
  percentage: number;
  dollarAmount: number;
}

interface ExpectedReturns {
  1: number;
  2: number;
  5: number;
  10: number;
}

interface MonthlyContribution {
  finalValue: number;
  totalContributions: number;
  totalGrowth: number;
  yearlyProjections: Array<{
    year: number;
    value: number;
    contributions: number;
    growth: number;
  }>;
}

interface ResultsDashboardProps {
  allocations: TickerAllocation[];
  expectedReturns: ExpectedReturns;
  monthlyContribution?: MonthlyContribution;
}

// Fidelity-inspired muted professional color palette for charts
const CHART_COLORS = [
  '#007A33', // Fidelity Green
  '#26A65B', // Soft Green
  '#2E2E2E', // Dark Gray
  '#757575', // Medium Gray
  '#5A8FA8', // Muted Blue
  '#8B7A6B', // Muted Brown
];

export function ResultsDashboard({ allocations, expectedReturns, monthlyContribution }: ResultsDashboardProps) {
  const initialAmount = allocations.reduce((sum, alloc) => sum + alloc.dollarAmount, 0);

  // Create color mapping for consistent colors across charts
  const tickerColors = new Map<string, string>();
  allocations.forEach((alloc, idx) => {
    tickerColors.set(alloc.ticker, CHART_COLORS[idx % CHART_COLORS.length]);
  });

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-fidelity shadow-fidelity">
          <p className="font-semibold text-fidelity-gray-dark text-sm">{data.name}</p>
          <p className="text-fidelity-green text-sm mt-1">
            {formatCurrency(data.value)} ({(data.payload.percentage * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate projected allocations for each year
  const getProjectedAllocations = (year: 1 | 2 | 5 | 10) => {
    const totalValue = expectedReturns[year];
    return allocations.map(alloc => ({
      ticker: alloc.ticker,
      percentage: alloc.percentage,
      dollarAmount: totalValue * alloc.percentage,
    }));
  };

  return (
    <div className="space-y-8">
      {/* Summary Card */}
      <div className="bg-fidelity-green p-8 text-white">
        <h2 className="text-2xl font-bold mb-6">Portfolio Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div>
            <p className="text-sm mb-2 opacity-90">Initial Investment</p>
            <p className="text-3xl font-bold">{formatCurrency(initialAmount)}</p>
          </div>
          <div>
            <p className="text-sm mb-2 opacity-90">1 Year Projection</p>
            <p className="text-3xl font-bold">{formatCurrency(expectedReturns[1])}</p>
          </div>
          <div>
            <p className="text-sm mb-2 opacity-90">2 Year Projection</p>
            <p className="text-3xl font-bold">{formatCurrency(expectedReturns[2])}</p>
          </div>
          <div>
            <p className="text-sm mb-2 opacity-90">5 Year Projection</p>
            <p className="text-3xl font-bold">{formatCurrency(expectedReturns[5])}</p>
          </div>
          <div>
            <p className="text-sm mb-2 opacity-90">10 Year Projection</p>
            <p className="text-3xl font-bold">{formatCurrency(expectedReturns[10])}</p>
          </div>
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Allocations */}
        <div className="space-y-8">
          {/* Allocations Table */}
          <div className="bg-white border border-fidelity shadow-fidelity p-8">
            <h2 className="text-2xl font-bold text-fidelity-gray-dark mb-6">
              Portfolio Allocations
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-fidelity">
                    <th className="text-left py-4 px-4 text-sm font-semibold text-fidelity-gray-medium">Ticker</th>
                    <th className="text-right py-4 px-4 text-sm font-semibold text-fidelity-gray-medium">Percentage</th>
                    <th className="text-right py-4 px-4 text-sm font-semibold text-fidelity-gray-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {allocations.map((allocation) => (
                    <tr
                      key={allocation.ticker}
                      className="border-b border-fidelity hover:bg-fidelity-gray-light"
                    >
                      <td className="py-4 px-4 text-fidelity-gray-dark font-medium">{allocation.ticker}</td>
                      <td className="py-4 px-4 text-right text-fidelity-gray-medium">
                        {(allocation.percentage * 100).toFixed(1)}%
                      </td>
                      <td className="py-4 px-4 text-right text-fidelity-gray-dark font-semibold">
                        {formatCurrency(allocation.dollarAmount)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-fidelity-gray-light font-semibold">
                    <td className="py-4 px-4 text-fidelity-gray-dark">Total</td>
                    <td className="py-4 px-4 text-right text-fidelity-gray-dark">100.0%</td>
                    <td className="py-4 px-4 text-right text-fidelity-green">
                      {formatCurrency(initialAmount)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Year 0 Pie Chart */}
          <div className="bg-white border border-fidelity shadow-fidelity p-8">
            <h2 className="text-2xl font-bold text-fidelity-gray-dark mb-6">
              Initial Allocation (Year 0)
            </h2>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={allocations.map(a => ({
                    name: a.ticker,
                    value: a.dollarAmount,
                    percentage: a.percentage,
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${(percentage * 100).toFixed(1)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {allocations.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={tickerColors.get(entry.ticker) || CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column: Projections */}
        <div>
          <div className="bg-white border border-fidelity shadow-fidelity p-8">
            <h2 className="text-2xl font-bold text-fidelity-gray-dark mb-6">
              Projected Growth
            </h2>
            <div className="space-y-8">
              {([1, 2, 5, 10] as const).map((year) => {
                const projectedAllocations = getProjectedAllocations(year);
                return (
                  <div
                    key={year}
                    className="bg-fidelity-gray-light p-6 border border-fidelity"
                  >
                    <h3 className="text-lg font-semibold text-fidelity-gray-dark mb-2">
                      {year} Year{year > 1 ? 's' : ''} Projection
                    </h3>
                    <p className="text-sm text-fidelity-gray-medium mb-4">
                      Total Value: {formatCurrency(expectedReturns[year])}
                    </p>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={projectedAllocations.map(a => ({
                            name: a.ticker,
                            value: a.dollarAmount,
                            percentage: a.percentage,
                          }))}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ percentage }) => `${(percentage * 100).toFixed(1)}%`}
                          outerRadius={90}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {projectedAllocations.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={tickerColors.get(entry.ticker) || CHART_COLORS[index % CHART_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Contribution Results */}
      {monthlyContribution && (
        <div className="bg-white border border-fidelity shadow-fidelity p-8">
          <h2 className="text-2xl font-bold text-fidelity-gray-dark mb-6">
            Monthly Contribution Projection
          </h2>
          
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-fidelity-gray-light p-6 border border-fidelity">
              <p className="text-sm text-fidelity-gray-medium mb-2">Final Projected Value</p>
              <p className="text-3xl font-bold text-fidelity-green">
                {formatCurrency(monthlyContribution.finalValue)}
              </p>
            </div>
            <div className="bg-fidelity-gray-light p-6 border border-fidelity">
              <p className="text-sm text-fidelity-gray-medium mb-2">Total Contributions</p>
              <p className="text-3xl font-bold text-fidelity-gray-dark">
                {formatCurrency(monthlyContribution.totalContributions)}
              </p>
            </div>
            <div className="bg-fidelity-gray-light p-6 border border-fidelity">
              <p className="text-sm text-fidelity-gray-medium mb-2">Total Growth</p>
              <p className="text-3xl font-bold text-fidelity-green">
                {formatCurrency(monthlyContribution.totalGrowth)}
              </p>
            </div>
          </div>

          {/* Growth Chart */}
          <div>
            <h3 className="text-xl font-semibold text-fidelity-gray-dark mb-4">
              Projected Growth Over Time
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={monthlyContribution.yearlyProjections}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis 
                  dataKey="year" 
                  stroke="#757575"
                  style={{ fontSize: '12px' }}
                  label={{ value: 'Year', position: 'insideBottom', offset: -5, style: { fill: '#757575' } }}
                />
                <YAxis 
                  stroke="#757575"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  label={{ value: 'Value ($)', angle: -90, position: 'insideLeft', style: { fill: '#757575' } }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E0E0E0',
                    borderRadius: '0',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)'
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#007A33" 
                  strokeWidth={3}
                  name="Projected Value"
                  dot={{ fill: '#007A33', r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="contributions" 
                  stroke="#757575" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Total Contributions"
                  dot={{ fill: '#757575', r: 3 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="growth" 
                  stroke="#26A65B" 
                  strokeWidth={2}
                  name="Growth"
                  dot={{ fill: '#26A65B', r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
