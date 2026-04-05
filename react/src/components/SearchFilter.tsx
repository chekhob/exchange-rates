interface SearchFilterProps {
  value: string;
  onChange: (query: string) => void;
  placeholder?: string;
}

export const SearchFilter = ({ value, onChange, placeholder }: SearchFilterProps) => {
  return (
    <div className="flex flex-col gap-2">
       <label htmlFor="currency-search" className="text-sm font-medium text-gray-800">
         Search Currencies
       </label>
      <input
        id="currency-search"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Search by currency code (USD, EUR, etc.)"}
        className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
       <p className="text-xs text-gray-600">
         Type to filter the list of currencies
       </p>
    </div>
  );
};