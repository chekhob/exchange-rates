import type { CurrencyRate } from '../types';
import { formatRate } from '../utils/currencyUtils';

interface ExchangeRateTableProps {
  rates: CurrencyRate[];
  baseCurrency: string;
  loading?: boolean;
}

export const ExchangeRateTable = ({ rates, baseCurrency, loading }: ExchangeRateTableProps) => {
  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (rates.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No currencies found. Try a different search.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
               Currency
             </th>
             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
               Code
             </th>
             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
               1 {baseCurrency} →
             </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rates.map(({ code, rate }) => (
            <tr key={code} className="hover:bg-gray-50">
               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-950">
                 {getCurrencyName(code)}
               </td>
               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                  {code}
                </span>
              </td>
               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                <span className="font-mono">
                  {formatRate(rate)} {code}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Helper function to get currency name (simplified)
const getCurrencyName = (code: string): string => {
  const names: Record<string, string> = {
    USD: 'US Dollar',
    EUR: 'Euro',
    GBP: 'British Pound',
    JPY: 'Japanese Yen',
    INR: 'Indian Rupee',
    CAD: 'Canadian Dollar',
    AUD: 'Australian Dollar',
    CHF: 'Swiss Franc',
    CNY: 'Chinese Yuan',
    AED: 'UAE Dirham',
    AFN: 'Afghan Afghani',
    ALL: 'Albanian Lek',
    AMD: 'Armenian Dram',
    ANG: 'Netherlands Antillean Guilder',
    AOA: 'Angolan Kwanza',
    ARS: 'Argentine Peso',
    NZD: 'New Zealand Dollar',
    SGD: 'Singapore Dollar',
    HKD: 'Hong Kong Dollar',
    KRW: 'South Korean Won',
  };
  return names[code] || code;
};