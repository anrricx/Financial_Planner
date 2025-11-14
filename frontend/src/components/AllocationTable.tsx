import { Allocation } from '../../../shared/types';

interface AllocationTableProps {
  allocations: Allocation[];
}

export function AllocationTable({ allocations }: AllocationTableProps) {
  const totalAmount = allocations.reduce((sum, alloc) => sum + alloc.dollarAmount, 0);

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
            <th className="text-right py-3 px-4 font-semibold text-gray-700">Percentage</th>
            <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
          </tr>
        </thead>
        <tbody>
          {allocations.map((allocation, index) => (
            <tr
              key={allocation.category}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="py-3 px-4 text-gray-900 font-medium">{allocation.category}</td>
              <td className="py-3 px-4 text-right text-gray-700">
                {(allocation.percentage * 100).toFixed(1)}%
              </td>
              <td className="py-3 px-4 text-right text-gray-900 font-semibold">
                ${allocation.dollarAmount.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
            </tr>
          ))}
          <tr className="bg-primary-50 font-semibold">
            <td className="py-3 px-4 text-gray-900">Total</td>
            <td className="py-3 px-4 text-right text-gray-900">100.0%</td>
            <td className="py-3 px-4 text-right text-primary-700">
              ${totalAmount.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

