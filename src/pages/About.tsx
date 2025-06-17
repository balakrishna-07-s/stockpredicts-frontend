
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const About = () => {
  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">About the Project</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Stock Sentiment Analysis Project</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                This project is a full-stack, real-time stock sentiment analysis web application 
                that integrates financial data with news sentiment to provide a comprehensive 
                trading research tool. By analyzing news articles related to stocks, the system 
                assigns sentiment labels (Positive, Neutral, or Negative) to help traders make 
                more informed decisions.
              </p>
              
              <h3 className="text-xl font-semibold mt-4">Key Features</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Real-time stock data retrieval using yfinance</li>
                <li>Technical analysis with 5 key indicators (RSI, SMA, EMA, MACD, Bollinger Bands)</li>
                <li>News sentiment analysis for both stock-specific and market news</li>
                <li>Interactive charting through TradingView integration</li>
                <li>Support for both Indian (BSE) and foreign stocks</li>
              </ul>
              
              <h3 className="text-xl font-semibold mt-4">Technical Stack</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold">Frontend</h4>
                  <ul className="list-disc list-inside">
                    <li>React.js with TypeScript</li>
                    <li>TailwindCSS for styling</li>
                    <li>TradingView widgets</li>
                    <li>Context API for state management</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold">Backend</h4>
                  <ul className="list-disc list-inside">
                    <li>Python Flask API</li>
                    <li>yfinance for stock data</li>
                    <li>TA-Lib for technical indicators</li>
                    <li>gnews for news retrieval</li>
                    <li>NLTK for sentiment analysis</li>
                  </ul>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mt-4">Project Objectives</h3>
              <p>
                The primary goal of this project is to demonstrate how data integration, 
                technical analysis, and sentiment analysis can be combined to create a 
                powerful tool for investors and traders. By identifying the sentiment in 
                news articles and correlating it with price action, users can gain additional 
                insights that might not be apparent from technical analysis alone.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Department Head</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <h3 className="font-semibold text-lg">Dr. Prakash B</h3>
              <p>R.M.C.A, M.Tech, M.Phil, Ph.D, MISTE</p>
              <p>Head of the Department</p>
              <p>Department of Computer Science</p>
              <p>Government First Grade College, Tiptur</p>
              <p className="mt-2">📞 +91 98803 48847</p>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>College Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Government First Grade College, Tiptur</p>
              <p>Department of Computer Science</p>
              <p>Tumkur District, Karnataka – 572201</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
