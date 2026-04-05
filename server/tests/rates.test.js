const request = require('supertest');
const app = require('../app');
const rateService = require('../services/rateService');

// Mock the rate service
jest.mock('../services/rateService');

describe('GET /api/rates', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Should return rates with default parameters', async () => {
    const mockRates = {
      last_updated_at: '2026-04-05T15:00:00Z',
      next_update_at: '2026-04-06T15:00:00Z',
      base: 'USD',
      rates: {
        USD: 1,
        EUR: 0.86562,
        GBP: 0.75476
      }
    };

    rateService.getLatestRates.mockResolvedValue(mockRates);

    const response = await request(app).get('/api/rates');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockRates);
    expect(rateService.getLatestRates).toHaveBeenCalledWith(undefined, undefined);
  });

  test('Should return rates with custom base currency', async () => {
    const mockRates = {
      last_updated_at: '2026-04-05T15:00:00Z',
      next_update_at: '2026-04-06T15:00:00Z',
      base: 'EUR',
      rates: {
        EUR: 1,
        USD: 1.155,
        GBP: 0.872
      }
    };

    rateService.getLatestRates.mockResolvedValue(mockRates);

    const response = await request(app).get('/api/rates?base=EUR');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockRates);
    expect(rateService.getLatestRates).toHaveBeenCalledWith('EUR', undefined);
  });

  test('Should return rates with specific symbols', async () => {
    const mockRates = {
      last_updated_at: '2026-04-05T15:00:00Z',
      next_update_at: '2026-04-06T15:00:00Z',
      base: 'USD',
      rates: {
        USD: 1,
        EUR: 0.86562,
        JPY: 110.25
      }
    };

    rateService.getLatestRates.mockResolvedValue(mockRates);

    const response = await request(app).get('/api/rates?symbols=EUR,JPY');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockRates);
    expect(rateService.getLatestRates).toHaveBeenCalledWith(undefined, 'EUR,JPY');
  });

  test('Should return 400 for invalid base currency', async () => {
    rateService.getLatestRates.mockRejectedValue(new Error('Invalid base currency code. Must be 3-letter ISO code.'));

    const response = await request(app).get('/api/rates?base=INVALID');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Failed to fetch exchange rates');
    expect(response.body.message).toContain('Invalid');
  });

  test('Should return 400 for invalid symbols', async () => {
    rateService.getLatestRates.mockRejectedValue(new Error('Invalid target currency code. Must be 3-letter ISO codes.'));

    const response = await request(app).get('/api/rates?symbols=USD,INVALID');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Failed to fetch exchange rates');
  });

  test('Should return 404 for unsupported currency', async () => {
    rateService.getLatestRates.mockRejectedValue(new Error('Currency not found'));

    const response = await request(app).get('/api/rates?base=XYZ');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Failed to fetch exchange rates');
  });

  test('Should return 500 for internal server error', async () => {
    rateService.getLatestRates.mockRejectedValue(new Error('Some internal error'));

    const response = await request(app).get('/api/rates');

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'Failed to fetch exchange rates');
  });
});