
import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { StockMarketType, useStock } from "@/context/StockContext";

const SearchForm = () => {
  const [symbol, setSymbol] = useState("");
  const [marketType, setMarketType] = useState<StockMarketType>("Indian");
  const { searchSymbol, isLoading, error } = useStock();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchSymbol(symbol, marketType);
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Enter stock symbol (e.g., TCS, AAPL)"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="w-full"
                autoComplete="off"
                required
              />
            </div>
            <div>
              <Select 
                value={marketType} 
                onValueChange={(value) => setMarketType(value as StockMarketType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Market" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Indian">Indian</SelectItem>
                  <SelectItem value="Foreign">Foreign</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-secondary hover:bg-secondary/80"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Analyze
              </span>
            )}
          </Button>
          
          {error && (
            <div className="text-destructive text-sm">{error}</div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default SearchForm;
