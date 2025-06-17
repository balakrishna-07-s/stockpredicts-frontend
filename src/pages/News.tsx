
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, TrendingUp, TrendingDown, Minus, Newspaper } from 'lucide-react';
import { useStock } from '@/context/StockContext';
import { formatDistanceToNow } from 'date-fns';
import SearchForm from '@/components/SearchForm';

const News = () => {
  const { stockData } = useStock();

  const getSentimentConfig = (sentimentValue: number | string) => {
    const sentimentStr = typeof sentimentValue === 'string' ? sentimentValue : 
      sentimentValue > 0 ? 'positive' : sentimentValue < 0 ? 'negative' : 'neutral';
    
    switch (sentimentStr) {
      case 'positive':
        return {
          color: 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25',
          icon: <TrendingUp className="h-5 w-5" />,
          label: 'Positive'
        };
      case 'negative':
        return {
          color: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25',
          icon: <TrendingDown className="h-5 w-5" />,
          label: 'Negative'
        };
      default:
        return {
          color: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg shadow-gray-500/25',
          icon: <Minus className="h-5 w-5" />,
          label: 'Neutral'
        };
    }
  };

  const getArticleSentimentConfig = (sentimentStr: string) => {
    switch (sentimentStr) {
      case 'positive':
        return {
          color: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25',
          icon: <TrendingUp className="h-4 w-4" />,
          label: 'Positive'
        };
      case 'negative':
        return {
          color: 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/25',
          icon: <TrendingDown className="h-4 w-4" />,
          label: 'Negative'
        };
      default:
        return {
          color: 'bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-lg shadow-slate-500/25',
          icon: <Minus className="h-4 w-4" />,
          label: 'Neutral'
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

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-4xl font-bold mb-6">News Analysis</h1>
      
      <div className="mb-8">
        <SearchForm />
      </div>

      {stockData && stockData.news && stockData.news.articles.length > 0 ? (
        <>
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-semibold">
              News for {stockData.fullName}
            </h2>
            <div className={`flex items-center gap-3 px-6 py-3 rounded-full ${getSentimentConfig(stockData.news.sentiment).color} border-0 font-semibold text-base tracking-wide shadow-xl`}>
              {getSentimentConfig(stockData.news.sentiment).icon}
              <span>Overall Sentiment: {getSentimentConfig(stockData.news.sentiment).label}</span>
              <span className="ml-2 bg-white/20 px-3 py-1 rounded-full text-sm">
                {stockData.news.sentiment.toFixed(2)}
              </span>
            </div>
          </div>
          
          <div className="space-y-6">
            {stockData.news.articles.map((article, index) => {
              const articleSentimentConfig = getArticleSentimentConfig(article.sentiment);
              return (
                <Card key={index} className="overflow-hidden shadow-lg border-2 hover:shadow-xl transition-all duration-300">
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block hover:bg-accent/30 transition-colors"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start gap-4">
                        <CardTitle className="text-2xl flex items-center gap-2 leading-relaxed">
                          {article.title}
                          <ExternalLink className="h-5 w-5 opacity-50 flex-shrink-0" />
                        </CardTitle>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${articleSentimentConfig.color} border-0 font-semibold text-sm tracking-wide flex-shrink-0`}>
                          {articleSentimentConfig.icon}
                          <span>{articleSentimentConfig.label}</span>
                          <span className="ml-1 bg-white/20 px-2 py-1 rounded-full text-xs">
                            {article.sentimentScore.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-base text-muted-foreground flex items-center gap-3">
                        <span className="font-semibold">{article.source}</span>
                        <span className="text-sm">•</span>
                        <span>{formatPublishedDate(article.published)}</span>
                      </div>
                    </CardContent>
                  </a>
                </Card>
              );
            })}
          </div>
        </>
      ) : (
        <Card className="p-8 shadow-lg border-2">
          <div className="text-center py-16">
            <Newspaper className="h-20 w-20 mx-auto mb-6 text-muted-foreground" />
            <h2 className="text-3xl font-semibold mb-4">No News Available</h2>
            <p className="text-muted-foreground text-lg">
              Search for a stock symbol to see news articles and sentiment analysis.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default News;
