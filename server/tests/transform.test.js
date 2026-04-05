const { fromExchangeRateAPI, fromFrankfurter, convertToISO8601 } = require('../utils/transform');

describe('Transform Utilities', () => {
  describe('convertToISO8601', () => {
    test('Should convert ExchangeRate-API date format to ISO 8601', () => {
      const input = 'Mon, 06 Apr 2026 00:00:01 +0000';
      const result = convertToISO8601(input);
      expect(result).toBe('2026-04-06T00:00:01.000Z');
    });

    test('Should handle invalid date string', () => {
      const result = convertToISO8601('invalid-date');
      expect(result).toBeNull();
    });

    test('Should handle empty string', () => {
      const result = convertToISO8601('');
      expect(result).toBeNull();
    });
  });

  describe('fromExchangeRateAPI', () => {
    test('Should transform ExchangeRate-API response correctly', () => {
      const input = {
        result: 'success',
        time_last_update_utc: 'Mon, 06 Apr 2026 00:00:01 +0000',
        time_next_update_utc: 'Tue, 07 Apr 2026 00:00:01 +0000',
        base_code: 'USD',
        conversion_rates: {
          EUR: 0.86562,
          GBP: 0.75476,
          JPY: 110.25
        }
      };

      const result = fromExchangeRateAPI(input);

      expect(result).toEqual({
        last_updated_at: '2026-04-06T00:00:01.000Z',
        next_update_at: '2026-04-07T00:00:01.000Z',
        base: 'USD',
        rates: {
          USD: 1,
          EUR: 0.86562,
          GBP: 0.75476,
          JPY: 110.25
        }
      });
    });

    test('Should throw error for invalid response', () => {
      expect(() => fromExchangeRateAPI(null)).toThrow('Invalid ExchangeRate-API response');
      expect(() => fromExchangeRateAPI({ result: 'error' })).toThrow('Invalid ExchangeRate-API response');
    });
  });

  describe('fromFrankfurter', () => {
    test('Should transform Frankfurter API response correctly', () => {
      const input = {
        base: 'EUR',
        date: '2026-04-05',
        rates: {
          USD: 1.155,
          GBP: 0.872,
          JPY: 130.45
        }
      };

      const result = fromFrankfurter(input);

      expect(result).toHaveProperty('last_updated_at', '2026-04-05T15:00:00Z');
      expect(result).toHaveProperty('next_update_at');
      expect(result.base).toBe('EUR');
      expect(result.rates).toEqual({
        EUR: 1,
        USD: 1.155,
        GBP: 0.872,
        JPY: 130.45
      });

      // Verify next_update_at is next day
      const nextUpdate = new Date(result.next_update_at);
      const lastUpdate = new Date(result.last_updated_at);
      expect(nextUpdate.getTime() - lastUpdate.getTime()).toBe(24 * 60 * 60 * 1000);
    });

    test('Should throw error for invalid response', () => {
      expect(() => fromFrankfurter(null)).toThrow('Invalid Frankfurter API response');
      expect(() => fromFrankfurter({})).toThrow('Invalid Frankfurter API response');
    });
  });
});