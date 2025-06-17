
import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceDot, ReferenceLine } from 'recharts';
import { format } from 'date-fns';

interface PatternPoint {
  x: string;
  y: number;
  label: string;
}

interface Pattern {
  type: string;
  description: string;
  points: PatternPoint[];
  sentiment: 'bullish' | 'bearish' | 'neutral';
}

interface ChartDataPoint {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface PatternAnalysis {
  chartData: ChartDataPoint[];
  patterns: Pattern[];
  error: string | null;
}

interface PatternChartProps {
  patternAnalysis: PatternAnalysis;
}

const PatternChart = ({ patternAnalysis }: PatternChartProps) => {
  // Add debugging
  console.log('PatternChart received:', patternAnalysis);
  console.log('Chart data length:', patternAnalysis?.chartData?.length || 0);
  console.log('Patterns found:', patternAnalysis?.patterns?.length || 0);

  if (patternAnalysis.error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pattern Analysis - 15 Minute Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-lg font-semibold text-red-500 mb-2">Error:</p>
            <p>{patternAnalysis.error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!patternAnalysis.chartData || patternAnalysis.chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pattern Analysis - 15 Minute Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-lg font-semibold mb-2">No Data Available</p>
            <p>No 15-minute data available for today</p>
            <p className="text-sm mt-2">Market might be closed or data unavailable</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prepare chart data with formatted time - add error handling
  const chartData = patternAnalysis.chartData.map((point, index) => {
    try {
      const timestamp = new Date(point.timestamp);
      return {
        ...point,
        time: format(timestamp, 'HH:mm'),
        fullTime: timestamp.toISOString(),
        index: index
      };
    } catch (error) {
      console.error('Error formatting timestamp:', point.timestamp, error);
      return {
        ...point,
        time: `T${index}`,
        fullTime: point.timestamp,
        index: index
      };
    }
  });

  console.log('Formatted chart data:', chartData.slice(0, 3)); // Log first 3 items

  // Color mapping for pattern sentiments
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return '#22c55e';
      case 'bearish': return '#ef4444';
      default: return '#6b7280';
    }
  };

  // Get pattern markers for the chart
  const getPatternMarkers = () => {
    const markers: JSX.Element[] = [];
    
    if (!patternAnalysis.patterns || patternAnalysis.patterns.length === 0) {
      return markers;
    }
    
    patternAnalysis.patterns.forEach((pattern, patternIndex) => {
      pattern.points.forEach((point, pointIndex) => {
        // Find matching data point - try both exact match and closest time
        let dataPoint = chartData.find(d => d.fullTime === point.x);
        
        if (!dataPoint) {
          // Try to find closest timestamp
          const targetTime = new Date(point.x).getTime();
          let closestPoint = null;
          let closestDiff = Infinity;
          
          chartData.forEach(d => {
            const diff = Math.abs(new Date(d.fullTime).getTime() - targetTime);
            if (diff < closestDiff) {
              closestDiff = diff;
              closestPoint = d;
            }
          });
          
          dataPoint = closestPoint;
        }
        
        if (dataPoint) {
          markers.push(
            <ReferenceDot
              key={`${patternIndex}-${pointIndex}`}
              x={dataPoint.time}
              y={point.y}
              r={6}
              fill={getSentimentColor(pattern.sentiment)}
              stroke="#ffffff"
              strokeWidth={2}
            />
          );
        }
      });
    });
    
    console.log('Generated markers:', markers.length);
    return markers;
  };

  const chartConfig = {
    close: {
      label: "Close Price",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Pattern Analysis - 15 Minute Chart (Today)</span>
          <Badge variant="outline">
            {patternAnalysis.patterns?.length || 0} Pattern{(patternAnalysis.patterns?.length || 0) !== 1 ? 's' : ''} Found
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Debug Info */}
          <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
            <p>Debug: {chartData.length} data points, {patternAnalysis.patterns?.length || 0} patterns</p>
            {chartData.length > 0 && (
              <p>Time range: {chartData[0].time} - {chartData[chartData.length - 1].time}</p>
            )}
          </div>

          {/* Chart */}
          <ChartContainer config={chartConfig} className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="time" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value.toFixed(2)}`}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value: any, name: string) => [
                    `$${value.toFixed(2)}`,
                    name
                  ]}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="close"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "hsl(var(--chart-1))" }}
                />
                {getPatternMarkers()}
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Pattern Descriptions */}
          {patternAnalysis.patterns && patternAnalysis.patterns.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Detected Patterns</h3>
              <div className="grid gap-4">
                {patternAnalysis.patterns.map((pattern, index) => (
                  <Card key={index} className="border-l-4" style={{ borderLeftColor: getSentimentColor(pattern.sentiment) }}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-lg">{pattern.type}</h4>
                        <Badge 
                          variant={pattern.sentiment === 'bullish' ? 'default' : pattern.sentiment === 'bearish' ? 'destructive' : 'secondary'}
                        >
                          {pattern.sentiment.charAt(0).toUpperCase() + pattern.sentiment.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{pattern.description}</p>
                      <div className="space-y-1">
                        <h5 className="font-medium text-sm">Pattern Points:</h5>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {pattern.points.map((point, pointIndex) => (
                            <div key={pointIndex} className="flex justify-between">
                              <span className="text-muted-foreground">{point.label}:</span>
                              <span className="font-mono">${point.y.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {(!patternAnalysis.patterns || patternAnalysis.patterns.length === 0) && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No significant patterns detected in today's 15-minute data.</p>
              <p className="text-sm mt-2">Patterns require sufficient price movement and clear formations to be identified.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PatternChart;
