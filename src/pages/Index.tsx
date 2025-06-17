
import { useStock } from '@/context/StockContext';
import AutocompleteSearch from '@/components/AutocompleteSearch';
import StockOverview from '@/components/StockOverview';
import PivotPrediction from '@/components/PivotPrediction';
import TradingViewChart from '@/components/TradingViewChart';
import IndicatorList from '@/components/IndicatorList';
import NewsSection from '@/components/NewsSection';
import PatternChart from '@/components/PatternChart';

const Index = () => {
  const { stockData } = useStock();

  // Add debugging for pattern analysis
  console.log('Stock data in Index:', stockData);
  console.log('Pattern analysis:', stockData?.patternAnalysis);

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Price Prediction of Stock Market</h1>
      
      <div className="mb-6">
        <AutocompleteSearch />
      </div>

      {stockData ? (
        <>
          <div className="mb-6">
            <StockOverview />
          </div>
          
          <div className="mb-6">
            <PivotPrediction />
          </div>
          
          <div className="mb-6">
            <TradingViewChart />
          </div>
          
          <div className="mb-6">
            <IndicatorList />
          </div>
          
          <div className="mb-6">
            <NewsSection />
          </div>

          {/* Always show PatternChart component to see what's happening */}
          <div className="mb-6">
            <PatternChart patternAnalysis={stockData.patternAnalysis || { chartData: [], patterns: [], error: 'No pattern analysis data available' }} />
          </div>
        </>
      ) : (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold mb-2">Welcome to Stock Market Price Predictor</h2>
          <p className="text-muted-foreground mb-4">
            Start typing a company name above to search and analyze stocks with intelligent autocomplete.
          </p>
          <div className="max-w-md mx-auto">
            <ul className="text-left list-disc list-inside space-y-2">
              <li>Search for Indian stocks (e.g., "Tata Consultancy", "Reliance Industries")</li>
              <li>Or search for foreign stocks (e.g., "Apple", "Microsoft", "Tesla")</li>
              <li>Fuzzy search handles spelling mistakes automatically</li>
              <li>View real-time price data and technical analysis</li>
              <li>Analyze news sentiment for each stock</li>
              <li>Detect stock patterns in 15-minute charts</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
