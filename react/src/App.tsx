import { useState } from 'react';
import { CurrencySelector } from './components/CurrencySelector';
import { SearchFilter } from './components/SearchFilter';
import { ExchangeRateTable } from './components/ExchangeRateTable';
import { LastUpdated } from './components/LastUpdated';
import { useExchangeRates } from './hooks/useExchangeRates';
import { filterCurrencies } from './utils/currencyUtils';

function App() {
  const [baseCurrency, setBaseCurrency] = useState('INR');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data, loading, error, refetch } = useExchangeRates(baseCurrency);

  const filteredRates = filterCurrencies(data?.rates || null, searchQuery);

  const handleCurrencyChange = (currency: string) => {
    setBaseCurrency(currency);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-950">Exchange Rates</h1>
              <p className="text-gray-600 mt-2">Real-time foreign exchange rates</p>
            </div>
            {data && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                 <LastUpdated timestamp={data.last_updated_at} nextUpdate={data.next_update_at} />
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar with controls */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <CurrencySelector
                value={baseCurrency}
                onChange={handleCurrencyChange}
                disabled={loading}
              />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <SearchFilter
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="USD, EUR, GBP, etc."
              />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
               <h3 className="text-lg font-semibold text-gray-900 mb-4">How to use</h3>
               <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs">1</span>
                  Select a base currency from the dropdown
                </li>
                <li className="flex items-start gap-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs">2</span>
                  Search/filter currencies using the search box
                </li>
                <li className="flex items-start gap-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs">3</span>
                  View exchange rates in the table
                </li>
              </ul>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                 <h3 className="text-lg font-semibold text-red-900 mb-2">Error</h3>
                <p className="text-red-600">{error}</p>
                <button
                  onClick={() => refetch()}
                  className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Retry
                </button>
              </div>
            )}
          </div>

          {/* Main content - Rates table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="border-b p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                     <h2 className="text-2xl font-bold text-gray-950">
                       Exchange Rates for {baseCurrency}
                     </h2>
                    <p className="text-gray-600 mt-1">
                      Showing {filteredRates.length} currency{filteredRates.length !== 1 ? 's' : ''}
                      {searchQuery && ` matching "${searchQuery}"`}
                    </p>
                  </div>
                  <button
                    onClick={() => refetch()}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Refreshing...' : 'Refresh Rates'}
                  </button>
                </div>
              </div>

              <div className="p-6">
                <ExchangeRateTable
                  rates={filteredRates}
                  baseCurrency={baseCurrency}
                  loading={loading}
                />
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">About the data</h3>
                 <p className="text-gray-700 text-sm">
                   Exchange rates are updated daily from reliable financial sources.
                  Rates are relative to the selected base currency and represent
                  the mid-market rate (average of buy and sell rates).
                </p>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Note</h3>
                 <p className="text-gray-700 text-sm">
                   This application currently uses mock data for demonstration.
                  Real API integration will be added when the backend server is ready.
                  The interface and functionality are fully operational.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-12 border-t bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>Exchange Rates Dashboard • Built with React, TypeScript, and Tailwind CSS</p>
          <p className="mt-2">Mock data • Real API integration pending server completion</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
