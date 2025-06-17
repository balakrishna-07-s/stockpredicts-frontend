
import { useEffect, useRef } from 'react';
import { useStock } from '@/context/StockContext';
import { Card } from '@/components/ui/card';

declare global {
  interface Window {
    TradingView?: any;
  }
}

const TradingViewChart = () => {
  const { stockData } = useStock();
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    // Create script tag for TradingView widget
    if (!scriptRef.current) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      document.head.appendChild(script);
      scriptRef.current = script;
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  useEffect(() => {
    if (!stockData || !containerRef.current) return;

    // Make sure TradingView is loaded
    const loadWidget = () => {
      if (window.TradingView && containerRef.current) {
        containerRef.current.innerHTML = '';
        new window.TradingView.widget({
          width: '100%',
          height: 1000, // Reduced from 1500 to 1000 (33% smaller)
          symbol: stockData.tradingViewSymbol,
          interval: 'D',
          timezone: 'Asia/Kolkata',
          theme: 'light',
          style: '1',
          locale: 'en',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          hide_side_toolbar: false,
          allow_symbol_change: false,
          studies: [
            'RSI@tv-basicstudies',
            'MACD@tv-basicstudies',
            'BB@tv-basicstudies'
          ],
          container_id: containerRef.current.id,
        });
      }
    };

    if (window.TradingView) {
      loadWidget();
    } else {
      scriptRef.current?.addEventListener('load', loadWidget);
    }

    return () => {
      scriptRef.current?.removeEventListener('load', loadWidget);
    };
  }, [stockData]);

  if (!stockData) return null;

  return (
    <Card className="p-4 mb-6">
      <div className="tradingview-widget-container">
        <div id="tradingview_chart" ref={containerRef} className="h-[1000px] w-full"></div>
      </div>
    </Card>
  );
};

export default TradingViewChart;
