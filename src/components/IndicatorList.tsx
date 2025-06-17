
import { useStock } from '@/context/StockContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';

const IndicatorList = () => {
  const { stockData } = useStock();

  if (!stockData) return null;

  const { indicators, currencySymbol } = stockData;
  
  // Format sentiment based on value and type with null/undefined check
  const formatSentimentWithScore = (type: string, score: number | undefined): string => {
    if (score === undefined || score === null) {
      return type.charAt(0).toUpperCase() + type.slice(1);
    }
    return `${type.charAt(0).toUpperCase() + type.slice(1)} (${score.toFixed(2)})`;
  };
  
  // Determine sentiment type from score with null/undefined check
  const getSentimentType = (score: number | undefined): string => {
    if (score === undefined || score === null) return 'neutral';
    if (score > 0.15) return 'positive';
    if (score < -0.15) return 'negative';
    return 'neutral';
  };

  // Get sentiment configuration with gradient styling
  const getSentimentConfig = (sentimentValue: number | undefined) => {
    const sentimentStr = getSentimentType(sentimentValue);
    
    switch (sentimentStr) {
      case 'positive':
        return {
          color: 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25',
          icon: <TrendingUp className="h-3 w-3" />,
          label: 'Bullish'
        };
      case 'negative':
        return {
          color: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25',
          icon: <TrendingDown className="h-3 w-3" />,
          label: 'Bearish'
        };
      default:
        return {
          color: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg shadow-gray-500/25',
          icon: <Minus className="h-3 w-3" />,
          label: 'Neutral'
        };
    }
  };

  const renderSentimentBadge = (score: number | undefined) => {
    if (score === undefined || score === null) return '-';
    
    const config = getSentimentConfig(score);
    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${config.color} border-0 font-semibold text-xs tracking-wide`}>
        {config.icon}
        <span>{config.label}</span>
        <span className="ml-1 bg-white/20 px-1.5 py-0.5 rounded-full text-xs">
          {score.toFixed(2)}
        </span>
      </div>
    );
  };
  
  return (
    <Card className="shadow-lg border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <BarChart3 className="h-6 w-6" />
          Technical Indicators
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* RSI Section */}
          <div className="p-4 border-2 rounded-lg bg-accent/20">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="font-semibold text-lg">RSI (14)</h3>
                <p className="text-xs text-muted-foreground">
                  Relative Strength Index measures momentum on a 0-100 scale. Values above 70 suggest overbought conditions, below 30 suggest oversold.
                </p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold">{indicators.rsi.toFixed(2)}</div>
                <div className="mt-1">
                  {renderSentimentBadge(indicators.rsiSentiment)}
                </div>
              </div>
            </div>
          </div>

          {/* Moving Averages Section */}
          <div className="p-4 border-2 rounded-lg bg-accent/20">
            <h3 className="font-semibold text-lg mb-2">Moving Averages</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Moving averages smooth price data to identify trends. SMA uses equal weights, EMA gives more weight to recent prices.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">SMA (20)</div>
                <div className="text-lg font-bold">{currencySymbol}{indicators.sma.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">EMA (20)</div>
                <div className="text-lg font-bold">{currencySymbol}{indicators.ema.toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* MACD Section */}
          <div className="p-4 border-2 rounded-lg bg-accent/20">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg">MACD</h3>
                <p className="text-xs text-muted-foreground">
                  Moving Average Convergence Divergence shows the relationship between two moving averages. Crossovers indicate potential trend changes.
                </p>
              </div>
              <div className="text-right">
                {renderSentimentBadge(indicators.macd.sentiment)}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-3">
              <div>
                <div className="text-sm text-muted-foreground">MACD Line</div>
                <div className="text-base font-bold">{indicators.macd.macd.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Signal Line</div>
                <div className="text-base font-bold">{indicators.macd.signal.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Histogram</div>
                <div className="text-base font-bold">{indicators.macd.histogram.toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* Bollinger Bands Section */}
          <div className="p-4 border-2 rounded-lg bg-accent/20">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg">Bollinger Bands</h3>
                <p className="text-xs text-muted-foreground">
                  Three lines: middle (SMA), upper and lower bands (2 standard deviations). Price touching bands may indicate reversal points.
                </p>
              </div>
              <div className="text-right">
                {renderSentimentBadge(indicators.bollingerBands.predictionSentiment)}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-3">
              <div>
                <div className="text-sm text-muted-foreground">Upper Band</div>
                <div className="text-base font-bold">{currencySymbol}{indicators.bollingerBands.upper.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Middle (SMA)</div>
                <div className="text-base font-bold">{currencySymbol}{indicators.bollingerBands.middle.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Lower Band</div>
                <div className="text-base font-bold">{currencySymbol}{indicators.bollingerBands.lower.toFixed(2)}</div>
              </div>
            </div>
            <div className="mt-3 p-2 bg-muted/50 rounded">
              <div className="text-sm font-medium">Prediction:</div>
              <div className="text-sm text-muted-foreground">{indicators.bollingerBands.prediction}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IndicatorList;
