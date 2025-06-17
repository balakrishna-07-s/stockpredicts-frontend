
import { createContext, useContext, useState, ReactNode } from 'react';

export type StockMarketType = 'Indian' | 'Foreign';
export type SentimentType = 'positive' | 'neutral' | 'negative';

export interface NewsArticle {
  title: string;
  url: string;
  published: string;
  source: string;
  sentiment: SentimentType;
  sentimentScore: number;
}

export interface PivotPrediction {
  period: string;
  high: number;
  low: number;
  close: number;
  pivot: number;
  resistance1: number;
  support1: number;
}

export interface PatternPoint {
  x: string;
  y: number;
  label: string;
}

export interface Pattern {
  type: string;
  description: string;
  points: PatternPoint[];
  sentiment: 'bullish' | 'bearish' | 'neutral';
}

export interface ChartDataPoint {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface PatternAnalysis {
  chartData: ChartDataPoint[];
  patterns: Pattern[];
  error: string | null;
}

export interface StockData {
  symbol: string;
  displaySymbol: string;
  fullName: string;
  currentPrice: number;
  previousClose?: number;
  change?: number;
  changePercent?: number;
  marketType: StockMarketType;
  currencySymbol: string;
  yfinanceSymbol: string;
  tradingViewSymbol: string;
  sentiment: SentimentType;
  sentimentScore?: number;
  indicators: {
    rsi: number;
    rsiSentiment: number;
    sma: number;
    ema: number;
    macd: {
      macd: number;
      signal: number;
      histogram: number;
      sentiment: number;
    };
    bollingerBands: {
      upper: number;
      middle: number;
      lower: number;
      prediction: string;
      predictionSentiment: number;
    };
  };
  pivotPredictions: PivotPrediction[];
  news: {
    articles: NewsArticle[];
    sentiment: number;
  };
  patternAnalysis?: PatternAnalysis;
  isLoading: boolean;
  error: string | null;
}

interface StockContextType {
  stockData: StockData | null;
  setStockData: (data: StockData | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  searchSymbol: (symbol: string, marketType: StockMarketType) => void;
}

const StockContext = createContext<StockContextType | undefined>(undefined);

// Configure API URL based on environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://stockpredicts-backend0.onrender.com';

export function StockProvider({ children }: { children: ReactNode }) {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to convert symbols based on market type
  const convertSymbol = (symbol: string, marketType: StockMarketType) => {
    const cleanSymbol = symbol.trim().toUpperCase();
    
    if (marketType === 'Indian') {
      return {
        displaySymbol: cleanSymbol,
        yfinanceSymbol: `${cleanSymbol}.BO`,
        tradingViewSymbol: `BSE:${cleanSymbol}`
      };
    }
    
    return {
      displaySymbol: cleanSymbol,
      yfinanceSymbol: cleanSymbol,
      tradingViewSymbol: cleanSymbol
    };
  };

  const searchSymbol = async (symbol: string, marketType: StockMarketType) => {
    if (!symbol) {
      setError("Please enter a stock symbol");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { displaySymbol } = convertSymbol(symbol, marketType);
      
      const apiUrl = `${API_BASE_URL}/api/stock?symbol=${encodeURIComponent(symbol)}&marketType=${encodeURIComponent(marketType)}`;
      
      console.log(`Fetching data from: ${apiUrl}`);
      
      const response = await fetch(apiUrl, { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      setStockData(data);
      
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setError("Error fetching stock data. Please check if the backend server is running and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    stockData,
    setStockData,
    isLoading,
    setIsLoading,
    error,
    setError,
    searchSymbol
  };

  return <StockContext.Provider value={value}>{children}</StockContext.Provider>;
}

export function useStock() {
  const context = useContext(StockContext);
  if (context === undefined) {
    throw new Error('useStock must be used within a StockProvider');
  }
  return context;
}
