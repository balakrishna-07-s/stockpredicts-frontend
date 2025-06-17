
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Clock, Target, BarChart3 } from 'lucide-react';
import { useStock } from '@/context/StockContext';

const PivotPrediction: React.FC = () => {
  const { stockData } = useStock();
  
  if (!stockData || !stockData.pivotPredictions || stockData.pivotPredictions.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Price Prediction
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Real-time pivot analysis for intraday support and resistance levels
          </p>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading price predictions...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { currentPrice, currencySymbol, pivotPredictions } = stockData;

  const getPivotDirection = (pivot: number, current: number) => {
    const diff = ((pivot - current) / current) * 100;
    if (diff > 0.5) return { 
      direction: 'bullish', 
      color: 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25',
      icon: <TrendingUp className="h-4 w-4" />,
      label: 'Bullish'
    };
    if (diff < -0.5) return { 
      direction: 'bearish', 
      color: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25',
      icon: <TrendingDown className="h-4 w-4" />,
      label: 'Bearish'
    };
    return { 
      direction: 'neutral', 
      color: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg shadow-gray-500/25',
      icon: <Minus className="h-4 w-4" />,
      label: 'Neutral'
    };
  };

  const getTimeframeIcon = (period: string) => {
    if (period.includes('15-min')) return <Clock className="h-4 w-4" />;
    if (period.includes('1-hour')) return <Clock className="h-4 w-4" />;
    if (period.includes('Daily')) return <Target className="h-4 w-4" />;
    return <BarChart3 className="h-4 w-4" />;
  };

  return (
    <Card className="shadow-lg border-2">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <TrendingUp className="h-6 w-6" />
          Price Prediction
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Real-time pivot analysis using historical OHLC data for support and resistance levels
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pivotPredictions.map((timeframe, index) => {
            const pivotConfig = getPivotDirection(timeframe.pivot, currentPrice);
            const difference = timeframe.pivot - currentPrice;
            const differencePercent = ((difference / currentPrice) * 100);

            return (
              <div key={index} className="p-4 border-2 rounded-lg hover:bg-accent/50 transition-all duration-200 shadow-sm hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getTimeframeIcon(timeframe.period)}
                    <span className="font-medium">{timeframe.period}</span>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-full ${pivotConfig.color} border-0 font-semibold text-xs tracking-wide`}>
                    {pivotConfig.icon}
                    <span>{pivotConfig.label}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-2xl font-bold">
                    {currencySymbol}{timeframe.pivot.toFixed(2)}
                  </div>
                  
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">High:</span>
                      <span>{currencySymbol}{timeframe.high.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Low:</span>
                      <span>{currencySymbol}{timeframe.low.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Close:</span>
                      <span>{currencySymbol}{timeframe.close.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">R1:</span>
                      <span className="text-green-600 font-medium">{currencySymbol}{timeframe.resistance1.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">S1:</span>
                      <span className="text-red-600 font-medium">{currencySymbol}{timeframe.support1.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">vs Current:</span>
                      <span className={`text-sm font-medium ${difference > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {difference > 0 ? '+' : ''}{difference.toFixed(2)} ({differencePercent.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> Pivot prices are calculated using previous period's High, Low, and Close prices. 
            R1/S1 represent the first resistance and support levels. These levels act as potential turning points 
            where price might react or reverse direction.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PivotPrediction;
