const rateService = require('../services/rateService');
const exchangeRateService = require('../services/exchangeRateService');
const frankfurterService = require('../services/frankfurterService');

jest.mock('../services/exchangeRateService');
jest.mock('../services/frankfurterService');

describe('Rate Service (Orchestrator)', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('Parameter validation', () => {
    test('Should validate base currency format', async () => {
      await expect(rateService.getLatestRates('US')).rejects.toThrow('Invalid base currency code');
      await expect(rateService.getLatestRates('USDD')).rejects.toThrow('Invalid base currency code');
      await expect(rateService.getLatestRates('123')).rejects.toThrow('Invalid base currency code');
    });

    test('Should validate target currencies format', async () => {
      await expect(rateService.getLatestRates('USD', ['EUR', 'INVALID'])).rejects.toThrow('Invalid target currency code');
      await expect(rateService.getLatestRates('USD', 'EUR,INVALID')).rejects.toThrow('Invalid target currency code');
    });
  });

  describe('API selection logic', () => {
    test('Should use ExchangeRate-API when API key is available', async () => {
      process.env.EXCHANGERATE_API_KEY = 'test-key';
      const mockRates = { base: 'USD', rates: {} };
      exchangeRateService.getLatestRates.mockResolvedValue(mockRates);

      const result = await rateService.getLatestRates('USD');

      expect(exchangeRateService.getLatestRates).toHaveBeenCalledWith('test-key', 'USD', []);
      expect(frankfurterService.getLatestRates).not.toHaveBeenCalled();
      expect(result).toBe(mockRates);
    });

    test('Should fallback to Frankfurter when ExchangeRate-API fails', async () => {
      process.env.EXCHANGERATE_API_KEY = 'test-key';
      const mockError = new Error('API error');
      const mockRates = { base: 'USD', rates: {} };
      
      exchangeRateService.getLatestRates.mockRejectedValue(mockError);
      frankfurterService.getLatestRates.mockResolvedValue(mockRates);

      const result = await rateService.getLatestRates('USD');

      expect(exchangeRateService.getLatestRates).toHaveBeenCalled();
      expect(frankfurterService.getLatestRates).toHaveBeenCalledWith('USD', []);
      expect(result).toBe(mockRates);
    });

    test('Should use Frankfurter when no API key is available', async () => {
      process.env.EXCHANGERATE_API_KEY = '';
      const mockRates = { base: 'USD', rates: {} };
      frankfurterService.getLatestRates.mockResolvedValue(mockRates);

      const result = await rateService.getLatestRates('USD');

      expect(exchangeRateService.getLatestRates).not.toHaveBeenCalled();
      expect(frankfurterService.getLatestRates).toHaveBeenCalledWith('USD', []);
      expect(result).toBe(mockRates);
    });

    test('Should throw error when both APIs fail', async () => {
      process.env.EXCHANGERATE_API_KEY = 'test-key';
      const mockError = new Error('API error');
      
      exchangeRateService.getLatestRates.mockRejectedValue(mockError);
      frankfurterService.getLatestRates.mockRejectedValue(mockError);

      await expect(rateService.getLatestRates('USD')).rejects.toThrow('Failed to fetch exchange rates');
    });
  });

  describe('Parameter normalization', () => {
    test('Should normalize base currency to uppercase', async () => {
      process.env.EXCHANGERATE_API_KEY = 'test-key';
      exchangeRateService.getLatestRates.mockResolvedValue({});

      await rateService.getLatestRates('usd', ['eur', 'gbp']);

      expect(exchangeRateService.getLatestRates).toHaveBeenCalledWith(
        'test-key',
        'USD',
        ['EUR', 'GBP']
      );
    });

    test('Should handle string symbols parameter', async () => {
      process.env.EXCHANGERATE_API_KEY = 'test-key';
      exchangeRateService.getLatestRates.mockResolvedValue({});

      await rateService.getLatestRates('USD', 'EUR,GBP, JPY');

      expect(exchangeRateService.getLatestRates).toHaveBeenCalledWith(
        'test-key',
        'USD',
        ['EUR', 'GBP', 'JPY']
      );
    });

    test('Should handle empty symbols parameter', async () => {
      process.env.EXCHANGERATE_API_KEY = 'test-key';
      exchangeRateService.getLatestRates.mockResolvedValue({});

      await rateService.getLatestRates('USD');
      await rateService.getLatestRates('USD', '');
      await rateService.getLatestRates('USD', []);

      // All should call with empty array
      expect(exchangeRateService.getLatestRates.mock.calls[0][2]).toEqual([]);
      expect(exchangeRateService.getLatestRates.mock.calls[1][2]).toEqual([]);
      expect(exchangeRateService.getLatestRates.mock.calls[2][2]).toEqual([]);
    });
  });
});