/**
 * Transform ExchangeRate-API response to simplified format
 * @param {Object} data - Original ExchangeRate-API response
 * @returns {Object} Simplified response
 */
function fromExchangeRateAPI(data) {
  if (!data || data.result !== 'success') {
    throw new Error('Invalid ExchangeRate-API response');
  }

  return {
    last_updated_at: convertToISO8601(data.time_last_update_utc),
    next_update_at: convertToISO8601(data.time_next_update_utc),
    base: data.base_code,
    rates: {
      [data.base_code]: 1,
      ...data.conversion_rates
    }
  };
}

/**
 * Transform Frankfurter API response to simplified format
 * @param {Object} data - Original Frankfurter API response
 * @returns {Object} Simplified response
 */
function fromFrankfurter(data) {
  if (!data || !data.base || !data.rates) {
    throw new Error('Invalid Frankfurter API response');
  }

  // Frankfurter updates around 16:00 CET, which is 15:00 UTC
  // We'll use the date from response and assume update at 15:00 UTC
  const lastUpdated = `${data.date}T15:00:00Z`;
  
  // Next update is next day at same time
  const nextUpdateDate = new Date(lastUpdated);
  nextUpdateDate.setDate(nextUpdateDate.getDate() + 1);
  const nextUpdate = nextUpdateDate.toISOString();

  return {
    last_updated_at: lastUpdated,
    next_update_at: nextUpdate,
    base: data.base,
    rates: {
      [data.base]: 1,
      ...data.rates
    }
  };
}

/**
 * Convert date string to ISO 8601 format
 * @param {string} dateStr - Date string in various formats
 * @returns {string} ISO 8601 string
 */
function convertToISO8601(dateStr) {
  if (!dateStr) return null;
  
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    return date.toISOString();
  } catch (error) {
    console.warn(`Failed to convert date: ${dateStr}`, error);
    return null;
  }
}

module.exports = {
  fromExchangeRateAPI,
  fromFrankfurter,
  convertToISO8601
};