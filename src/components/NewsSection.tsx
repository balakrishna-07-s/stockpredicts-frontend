
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Newspaper, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useStock } from '@/context/StockContext';
import { formatDistanceToNow } from 'date-fns';

const NewsSection: React.FC = () => {
  const { stockData } = useStock();
  
  if (!stockData || !stockData.news) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>News</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground">
              Loading news...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { articles, sentiment } = stockData.news;
  
  const getSentimentConfig = (sentimentValue: number | string) => {
    const sentimentStr = typeof sentimentValue === 'string' ? sentimentValue : 
      sentimentValue > 0 ? 'positive' : sentimentValue < 0 ? 'negative' : 'neutral';
    
    switch (sentimentStr) {
      case 'positive':
        return {
          color: 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25',
          icon: <TrendingUp className="h-4 w-4" />,
          label: 'Positive'
        };
      case 'negative':
        return {
          color: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25',
          icon: <TrendingDown className="h-4 w-4" />,
          label: 'Negative'
        };
      default:
        return {
          color: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg shadow-gray-500/25',
          icon: <Minus className="h-4 w-4" />,
          label: 'Neutral'
        };
    }
  };

  const getArticleSentimentConfig = (sentimentStr: string) => {
    switch (sentimentStr) {
      case 'positive':
        return {
          color: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-500/20',
          icon: <TrendingUp className="h-3 w-3" />
        };
      case 'negative':
        return {
          color: 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-md shadow-rose-500/20',
          icon: <TrendingDown className="h-3 w-3" />
        };
      default:
        return {
          color: 'bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-md shadow-slate-500/20',
          icon: <Minus className="h-3 w-3" />
        };
    }
  };

  // Try to parse the date and format it, if it fails, just return the original string
  const formatPublishedDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return dateString;
    }
  };

  const overallSentimentConfig = getSentimentConfig(sentiment);

  return (
    <Card className="shadow-lg border-2">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Newspaper className="h-6 w-6" />
            News
          </CardTitle>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${overallSentimentConfig.color} border-0 font-semibold text-sm tracking-wide`}>
            {overallSentimentConfig.icon}
            <span>Overall: {overallSentimentConfig.label}</span>
            <span className="ml-1 bg-white/20 px-2 py-1 rounded-full text-xs">
              {sentiment.toFixed(2)}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {articles.length > 0 ? (
          <div className="space-y-4">
            {articles.map((article, index) => {
              const articleSentimentConfig = getArticleSentimentConfig(article.sentiment);
              return (
                <div 
                  key={index} 
                  className="p-4 border-2 rounded-lg hover:bg-accent/50 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-grow">
                        <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                          {article.title}
                          <ExternalLink className="h-4 w-4 opacity-50 flex-shrink-0" />
                        </h3>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="font-medium">{article.source}</span>
                          <span className="text-xs">•</span>
                          <span>{formatPublishedDate(article.published)}</span>
                        </div>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-full ${articleSentimentConfig.color} border-0 font-semibold text-xs tracking-wide flex-shrink-0`}>
                        {articleSentimentConfig.icon}
                        <span>{article.sentimentScore.toFixed(2)}</span>
                      </div>
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Newspaper className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground text-lg">
              No news articles found. We are working to improve news retrieval for this stock.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NewsSection;
