import { YearlyProjection, Allocation } from '../../../shared/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface PortfolioChartsProps {
  initialAllocations: Allocation[];
  projections: YearlyProjection[];
}

const COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#cbd5e1', '#e2e8f0', '#f1f5f9'];

export function PortfolioCharts({ initialAllocations, projections }: PortfolioChartsProps) {
  // Get all unique categories from initial allocations and all projections
  const allCategories = new Set<string>();
  initialAllocations.forEach(alloc => allCategories.add(alloc.category));
  projections.forEach(proj => {
    proj.allocations.forEach(alloc => allCategories.add(alloc.category));
  });

  // Create color mapping for consistent colors across charts
  const categoryColors = new Map<string, string>();
  Array.from(allCategories).forEach((cat, idx) => {
    categoryColors.set(cat, COLORS[idx % COLORS.length]);
  });

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-primary-600">
            {formatCurrency(data.value)} ({(data.payload.percentage * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Year 0 Chart */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          Initial Allocation (Year 0)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={initialAllocations.map(a => ({
                name: a.category,
                value: a.dollarAmount,
                percentage: a.percentage,
              }))}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${name}: ${(percentage * 100).toFixed(1)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {initialAllocations.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={categoryColors.get(entry.category) || COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Yearly Projection Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projections.map((projection) => (
          <div
            key={projection.year}
            className="bg-gray-50 rounded-lg p-4 border border-gray-200 transition-all duration-300 hover:shadow-md"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
              Year {projection.year}
            </h3>
            <p className="text-center text-sm text-gray-600 mb-4">
              Total Value: {formatCurrency(projection.totalValue)}
            </p>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={projection.allocations.map(a => ({
                    name: a.category,
                    value: a.dollarAmount,
                    percentage: a.percentage,
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ percentage }) => `${(percentage * 100).toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {projection.allocations.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={categoryColors.get(entry.category) || COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );
}

