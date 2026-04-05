const exchangeRateService = require('./exchangeRateService');
const frankfurterService = require('./frankfurterService');

/**
 * Get latest exchange rates with fallback logic
 * @param {string} baseCurrency - Base currency code (default: USD)
 * @param {string|string[]} symbols - Comma-separated string or array of target currency codes (empty for all)
 * @returns {Promise<Object>} Simplified rates data
 */
async function getLatestRates(baseCurrency = 'USD', symbols = []) {
  // Normalize parameters
  const base = (baseCurrency || 'USD').toUpperCase();
  const targetCurrencies = Array.isArray(symbols) 
    ? symbols.map(s => s.toUpperCase())
    : (symbols ? symbols.split(',').map(s => s.trim().toUpperCase()) : []);

  // Validate base currency
  if (!/^[A-Z]{3}$/.test(base)) {
    throw new Error('Invalid base currency code. Must be 3-letter ISO code.');
  }

  // Validate target currencies
  if (targetCurrencies.some(currency => !/^[A-Z]{3}$/.test(currency))) {
    throw new Error('Invalid target currency code. Must be 3-letter ISO codes.');
  }

  const apiKey = process.env.EXCHANGERATE_API_KEY;

  // Try ExchangeRate-API first if API key is available
  if (apiKey && apiKey.trim() !== '') {
    try {
      console.log('Attempting to fetch from ExchangeRate-API (primary)...');
      const rates = await exchangeRateService.getLatestRates(apiKey, base, targetCurrencies);
      console.log('Successfully fetched from ExchangeRate-API');
      return rates;
    } catch (error) {
      console.log(`ExchangeRate-API failed: ${error.message}. Falling back to Frankfurter API...`);
      // Continue to fallback
    }
  } else {
    console.log('No ExchangeRate-API key found. Using Frankfurter API...');
  }

  // Fallback to Frankfurter API
  try {
    console.log('Attempting to fetch from Frankfurter API (fallback)...');
    const rates = await frankfurterService.getLatestRates(base, targetCurrencies);
    console.log('Successfully fetched from Frankfurter API');
    return rates;
  } catch (error) {
    console.error('Both ExchangeRate-API and Frankfurter API failed:', error.message);
    throw new Error(`Failed to fetch exchange rates: ${error.message}`);
  }
}

module.exports = {
  getLatestRates
};