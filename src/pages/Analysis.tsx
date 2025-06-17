
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useStock } from '@/context/StockContext';
import SearchForm from '@/components/SearchForm';
import StockOverview from '@/components/StockOverview';
import TradingViewChart from '@/components/TradingViewChart';
import IndicatorList from '@/components/IndicatorList';
import PatternChart from '@/components/PatternChart';

const Analysis = () => {
  const { stockData, searchSymbol } = useStock();
  const { symbol } = useParams<{ symbol: string }>();

  useEffect(() => {
    if (symbol) {
      // If a symbol is provided in the route, perform auto search
      const isIndianStock = symbol.includes('.BO') || symbol.includes('BSE:');
      let cleanSymbol = symbol;
      
      // Clean up the symbol
      if (symbol.includes('.BO')) {
        cleanSymbol = symbol.replace('.BO', '');
      } else if (symbol.includes('BSE:')) {
        cleanSymbol = symbol.replace('BSE:', '');
      }
      
      searchSymbol(cleanSymbol, isIndianStock ? 'Indian' : 'Foreign');
    }
  }, [symbol, searchSymbol]);

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Stock Analysis {symbol && `for ${symbol}`}</h1>
      
      <div className="mb-6">
        <SearchForm />
      </div>

      {stockData ? (
        <>
          <div className="mb-6">
            <StockOverview />
          </div>
          
          <div className="mb-6">
            <TradingViewChart />
          </div>
          
          <div className="mb-6">
            <IndicatorList />
          </div>

          {stockData.patternAnalysis && (
            <div className="mb-6">
              <PatternChart patternAnalysis={stockData.patternAnalysis} />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold mb-2">Loading Analysis...</h2>
          <p className="text-muted-foreground">
            Please wait while we fetch the stock data.
          </p>
        </div>
      )}
    </div>
  );
};

export default Analysis;
