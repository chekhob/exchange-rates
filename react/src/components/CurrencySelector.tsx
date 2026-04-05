import { getCommonCurrencies } from '../utils/currencyUtils';

interface CurrencySelectorProps {
  value: string;
  onChange: (currency: string) => void;
  disabled?: boolean;
}

export const CurrencySelector = ({ value, onChange, disabled }: CurrencySelectorProps) => {
  const commonCurrencies = getCommonCurrencies();

  return (
    <div className="flex flex-col gap-2">
       <label htmlFor="currency-select" className="text-sm font-medium text-gray-800">
         Base Currency
       </label>
      <select
        id="currency-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        {commonCurrencies.map((currency) => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select>
       <p className="text-xs text-gray-600">
         Select the base currency to view exchange rates
       </p>
    </div>
  );
};