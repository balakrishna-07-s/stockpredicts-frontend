
import { useState, useRef, useEffect } from "react";
import { Search, Building2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StockMarketType, useStock } from "@/context/StockContext";
import { fuzzySearch, ALL_STOCKS, INDIAN_STOCKS, FOREIGN_STOCKS, StockItem } from "@/data/stockDatabase";

const AutocompleteSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStock, setSelectedStock] = useState<StockItem | null>(null);
  const [marketType, setMarketType] = useState<StockMarketType>("Indian");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { searchSymbol, isLoading, error } = useStock();
  const inputRef = useRef<HTMLInputElement>(null);

  const availableStocks = marketType === "Indian" ? INDIAN_STOCKS : FOREIGN_STOCKS;
  const searchResults = fuzzySearch(searchQuery, availableStocks, 8);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStock) {
      searchSymbol(selectedStock.symbol, selectedStock.marketType);
      setShowSuggestions(false);
    } else if (searchQuery.trim()) {
      // If no stock selected but query exists, try direct search
      searchSymbol(searchQuery.trim(), marketType);
      setShowSuggestions(false);
    }
  };

  const handleStockSelect = (stock: StockItem) => {
    setSelectedStock(stock);
    setSearchQuery(stock.fullName);
    setShowSuggestions(false);
  };

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    setSelectedStock(null);
    setShowSuggestions(value.length > 0);
  };

  const handleInputFocus = () => {
    if (searchQuery.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicks on suggestions
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const handleMarketTypeChange = (newMarketType: StockMarketType) => {
    setMarketType(newMarketType);
    setSearchQuery("");
    setSelectedStock(null);
    setShowSuggestions(false);
  };

  useEffect(() => {
    if (searchQuery.length === 0) {
      setSelectedStock(null);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Market Type Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Market</label>
            <Select value={marketType} onValueChange={handleMarketTypeChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select market type" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="Indian">Indian Stock Market</SelectItem>
                <SelectItem value="Foreign">Foreign Stock Market</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Input */}
          <div className="relative">
            <div className="relative">
              <Input
                ref={inputRef}
                placeholder={`Search ${marketType.toLowerCase()} stocks (e.g., ${marketType === "Indian" ? "Tata Consultancy Services, TCS" : "Apple, Microsoft, Tesla"})`}
                value={searchQuery}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className="w-full pr-10"
                autoComplete="off"
              />
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>

            {/* Search suggestions dropdown */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-y-auto">
                {searchQuery.length < 3 ? (
                  <div className="p-4 text-sm text-muted-foreground text-center">
                    Type at least 3 characters to search...
                  </div>
                ) : searchResults.length > 0 ? (
                  <div>
                    <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b bg-gray-50">
                      {marketType} Companies
                    </div>
                    {searchResults.map((stock) => (
                      <div
                        key={`${stock.symbol}-${stock.marketType}`}
                        onClick={() => handleStockSelect(stock)}
                        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center gap-3">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{stock.fullName}</div>
                            <div className="text-sm text-muted-foreground">
                              {stock.symbol} • {stock.marketType} Market
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-sm text-muted-foreground text-center">
                    No {marketType.toLowerCase()} companies found. Try different keywords or check spelling.
                  </div>
                )}
              </div>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full bg-secondary hover:bg-secondary/80"
            disabled={isLoading || (!selectedStock && !searchQuery.trim())}
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
                {selectedStock ? `Analyze ${selectedStock.symbol}` : "Search & Analyze"}
              </span>
            )}
          </Button>
          
          {error && (
            <div className="text-destructive text-sm">{error}</div>
          )}

          {selectedStock && (
            <div className="text-sm text-muted-foreground">
              Selected: <span className="font-medium">{selectedStock.fullName}</span> ({selectedStock.symbol})
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default AutocompleteSearch;
