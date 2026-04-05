import type { ExchangeRateResponse } from '../types';

const MOCK_RESPONSE: ExchangeRateResponse = {
  last_updated_at: "2026-04-05T00:00:01.000Z",
  next_update_at: "2026-04-06T00:00:01.000Z",
  base: "INR",
  rates: {
    "INR": 1,
    "AED": 0.03941,
    "AFN": 0.6905,
    "ALL": 0.8921,
    "AMD": 4.0502,
    "ANG": 0.01921,
    "AOA": 10.1574,
    "ARS": 14.8925,
    "AUD": 0.01556,
    "USD": 0.01073,
    "EUR": 0.00994,
    "GBP": 0.00852,
    "JPY": 1.634,
    "CAD": 0.01462,
    "CHF": 0.00968,
    "CNY": 0.07759,
    "NZD": 0.01768,
    "SGD": 0.01448,
    "HKD": 0.08389,
    "KRW": 14.67,
  }
};

const API_BASE_URL = '/api';

export const fetchExchangeRates = async (baseCurrency: string = 'INR'): Promise<ExchangeRateResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/rates?base=${baseCurrency}`);
    
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Validate response structure
    if (!data.last_updated_at || !data.next_update_at || !data.base || !data.rates) {
      console.warn('API response missing required fields, using mock data');
      return {
        ...MOCK_RESPONSE,
        base: baseCurrency,
      };
    }
    
    return data;
  } catch (error) {
    console.error('Failed to fetch exchange rates from API:', error);
    console.log('Falling back to mock data');
    
    // Return mock data as fallback
    return {
      ...MOCK_RESPONSE,
      base: baseCurrency,
    };
  }
};