const { fromFrankfurter } = require('../utils/transform');

/**
 * Fetch latest exchange rates from Frankfurter API
 * @param {string} baseCurrency - Base currency code (default: EUR)
 * @param {string[]} targetCurrencies - Array of target currency codes (empty for all)
 * @returns {Promise<Object>} Simplified rates data
 */
async function getLatestRates(baseCurrency = 'EUR', targetCurrencies = []) {
  if (!baseCurrency || typeof baseCurrency !== 'string' || baseCurrency.length !== 3) {
    throw new Error('Invalid base currency code');
  }

  const baseUrl = process.env.FRANKFURTER_API_BASE_URL || 'https://api.frankfurter.dev/v1';
  const url = new URL(`${baseUrl}/latest`);

  url.searchParams.set('base', baseCurrency);

  if (targetCurrencies.length > 0) {
    url.searchParams.set('symbols', targetCurrencies.join(','));
  }

  try {
    console.log(`Fetching rates from Frankfurter API for base: ${baseCurrency}`);
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Frankfurter API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    
    // Frankfurter returns 404 for invalid currencies
    if (data.error) {
      throw new Error(`Frankfurter API error: ${data.error}`);
    }

    return fromFrankfurter(data);
  } catch (error) {
    console.error('Frankfurter API fetch failed:', error.message);
    throw error;
  }
}

module.exports = {
  getLatestRates
};