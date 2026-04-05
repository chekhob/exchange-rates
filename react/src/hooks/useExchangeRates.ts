import { useState, useEffect, useRef } from 'react';
import type { ExchangeRatesState } from '../types';
import { fetchExchangeRates } from '../services/api';

export const useExchangeRates = (baseCurrency: string = 'INR') => {
  const [state, setState] = useState<ExchangeRatesState>({
    data: null,
    loading: true,
    error: null,
    lastUpdated: null,
  });
  const [fetchCount, setFetchCount] = useState(0);

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    
    const fetchData = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const data = await fetchExchangeRates(baseCurrency);
        if (mounted) {
          setState({
            data,
            loading: false,
            error: null,
            lastUpdated: new Date(),
          });
        }
      } catch (err) {
        if (mounted) {
          setState({
            data: null,
            loading: false,
            error: err instanceof Error ? err.message : 'Failed to fetch exchange rates',
            lastUpdated: null,
          });
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [baseCurrency, fetchCount]);

  const refetch = () => setFetchCount(c => c + 1);

  return {
    ...state,
    refetch,
  };
};