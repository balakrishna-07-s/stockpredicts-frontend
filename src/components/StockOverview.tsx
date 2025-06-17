
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStock } from "@/context/StockContext";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const StockOverview = () => {
  const { stockData } = useStock();

  if (!stockData) return null;

  const { 
    displaySymbol, 
    fullName, 
    currentPrice, 
    change, 
    changePercent, 
    sentiment,
    marketType,
    currencySymbol,
    sentimentScore
  } = stockData;

  const getSentimentConfig = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return {
          color: 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25',
          icon: <TrendingUp className="h-4 w-4" />,
          label: 'Bullish'
        };
      case 'negative':
        return {
          color: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25',
          icon: <TrendingDown className="h-4 w-4" />,
          label: 'Bearish'
        };
      default:
        return {
          color: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg shadow-gray-500/25',
          icon: <Minus className="h-4 w-4" />,
          label: 'Neutral'
        };
    }
  };

  const sentimentConfig = getSentimentConfig(sentiment);
  const changeColor = change && change > 0 ? 'text-green-600' : 'text-red-600';

  return (
    <Card className="bg-gradient-to-br from-white to-gray-50 border-2 shadow-xl">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-3xl flex items-center gap-3">
              {displaySymbol}
              <Badge variant="outline" className="text-sm font-medium bg-blue-50 text-blue-700 border-blue-200">
                {marketType}
              </Badge>
            </CardTitle>
            <p className="text-muted-foreground text-lg mt-1">{fullName}</p>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${sentimentConfig.color} border-0 font-semibold text-sm tracking-wide`}>
            {sentimentConfig.icon}
            <span>{sentimentConfig.label}</span>
            {sentimentScore !== undefined && (
              <span className="ml-1 bg-white/20 px-2 py-1 rounded-full text-xs">
                {sentimentScore.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-3">
          <span className="text-5xl font-bold text-gray-900">{currencySymbol}{currentPrice.toFixed(2)}</span>
          {change && changePercent && (
            <div className={`flex items-center gap-1 text-xl font-semibold ${changeColor} bg-gray-50 px-3 py-1 rounded-lg`}>
              {change > 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
              <span>
                {change > 0 ? '+' : ''}{change.toFixed(2)} ({changePercent.toFixed(2)}%)
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StockOverview;
