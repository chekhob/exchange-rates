export interface ExchangeRateResponse {
  last_updated_at: string;
  next_update_at: string;
  base: string;
  rates: Record<string, number>;
}

export interface CurrencyRate {
  code: string;
  rate: number;
}

export interface ExchangeRatesState {
  data: ExchangeRateResponse | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export type CurrencyCode = string; // e.g., 'USD', 'EUR', 'INR'