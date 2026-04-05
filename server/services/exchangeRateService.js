const { fromExchangeRateAPI } = require('../utils/transform');

const API_BASE_URL = 'https://v6.exchangerate-api.com/v6';

/**
 * Fetch latest exchange rates from ExchangeRate-API
 * @param {string} apiKey - ExchangeRate-API key
 * @param {string} baseCurrency - Base currency code (default: USD)
 * @param {string[]} targetCurrencies - Array of target currency codes (empty for all)
 * @returns {Promise<Object>} Simplified rates data
 */
async function getLatestRates(apiKey, baseCurrency = 'USD', targetCurrencies = []) {
  if (!apiKey) {
    throw new Error('ExchangeRate-API key is required');
  }

  if (!baseCurrency || typeof baseCurrency !== 'string' || baseCurrency.length !== 3) {
    throw new Error('Invalid base currency code');
  }

  const url = new URL(`${API_BASE_URL}/${apiKey}/latest/${baseCurrency}`);
  
  if (targetCurrencies.length > 0) {
    // ExchangeRate-API doesn't support filtering by symbols in the free tier
    // We'll fetch all and filter later
    console.log('Note: Currency filtering will be applied after fetch');
  }

  try {
    console.log(`Fetching rates from ExchangeRate-API for base: ${baseCurrency}`);
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`ExchangeRate-API error: ${response.status} ${response.statusText} - ${errorData['error-type'] || 'Unknown error'}`);
    }

    const data = await response.json();
    
    if (data.result === 'error') {
      throw new Error(`ExchangeRate-API error: ${data['error-type']}`);
    }

    // Filter rates if target currencies specified
    if (targetCurrencies.length > 0) {
      const filteredRates = {};
      targetCurrencies.forEach(currency => {
        if (data.conversion_rates[currency] !== undefined) {
          filteredRates[currency] = data.conversion_rates[currency];
        }
      });
      data.conversion_rates = filteredRates;
    }

    return fromExchangeRateAPI(data);
  } catch (error) {
    console.error('ExchangeRate-API fetch failed:', error.message);
    throw error;
  }
}

module.exports = {
  getLatestRates
};