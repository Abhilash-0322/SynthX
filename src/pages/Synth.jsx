import { useState, useEffect } from 'react';
import { TrendingUp, BarChart2, DollarSign, Clock, Settings, User, Menu, X, ChevronDown, RefreshCw, ArrowUp, ArrowDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Initial asset list - will be replaced with CoinGecko data
const initialAssets = [
  { symbol: 'sBTC', name: 'Synthetic Bitcoin', price: 0, change24h: 0, volume: 0 },
  { symbol: 'sETH', name: 'Synthetic Ethereum', price: 0, change24h: 0, volume: 0 },
  { symbol: 'sSOL', name: 'Synthetic Solana', price: 0, change24h: 0, volume: 0 },
  { symbol: 'sADA', name: 'Synthetic Cardano', price: 0, change24h: 0, volume: 0 },
  { symbol: 'sDOGE', name: 'Synthetic Dogecoin', price: 0, change24h: 0, volume: 0 },
  { symbol: 'sAVAX', name: 'Synthetic Avalanche', price: 0, change24h: 0, volume: 0 },
  { symbol: 'sDOT', name: 'Synthetic Polkadot', price: 0, change24h: 0, volume: 0 },
  { symbol: 'sMATIC', name: 'Synthetic Polygon', price: 0, change24h: 0, volume: 0 },
];

// Function to fetch data from CoinGecko API
const fetchCoinGeckoData = async () => {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=15&page=1&sparkline=false&price_change_percentage=24h');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data from CoinGecko:', error);
    return [];
  }
};

// Price history - Use CoinGecko API
const fetchPriceHistory = async (coinId, days = 30) => {
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    
    // Format the data to match our expected format for recharts
    return data.prices.map(([timestamp, price]) => ({
      date: new Date(timestamp).toLocaleDateString(),
      price: price,
      time: new Date(timestamp).toLocaleTimeString()
    }));
  } catch (error) {
    console.error('Error fetching price history from CoinGecko:', error);
    return [];
  }
};

// Mock orderbook data - Generate based on current price
const generateOrderbook = (currentPrice) => {
  const asks = [];
  const bids = [];
  
  for (let i = 1; i <= 10; i++) {
    asks.push({
      price: (currentPrice * (1 + (i * 0.001))).toFixed(2),
      amount: (Math.random() * 5 + 0.1).toFixed(4),
      total: ((currentPrice * (1 + (i * 0.001))) * (Math.random() * 5 + 0.1)).toFixed(2)
    });
    
    bids.push({
      price: (currentPrice * (1 - (i * 0.001))).toFixed(2),
      amount: (Math.random() * 5 + 0.1).toFixed(4),
      total: ((currentPrice * (1 - (i * 0.001))) * (Math.random() * 5 + 0.1)).toFixed(2)
    });
  }
  
  return { asks, bids };
};

// Mock recent trades
const generateRecentTrades = (currentPrice) => {
  const trades = [];
  for (let i = 0; i < 15; i++) {
    const isBuy = Math.random() > 0.5;
    const priceVariation = (Math.random() * 0.005) * (isBuy ? 1 : -1);
    trades.push({
      price: (currentPrice * (1 + priceVariation)).toFixed(2),
      amount: (Math.random() * 2 + 0.01).toFixed(4),
      time: new Date(Date.now() - i * 60000).toLocaleTimeString(),
      type: isBuy ? 'buy' : 'sell'
    });
  }
  return trades;
};

// Get CoinGecko ID from symbol
const getCoinGeckoId = (symbol) => {
  // Map of common symbols to CoinGecko IDs
  const symbolToId = {
    'sBTC': 'bitcoin',
    'sETH': 'ethereum',
    'sSOL': 'solana',
    'sADA': 'cardano',
    'sDOGE': 'dogecoin',
    'sAVAX': 'avalanche-2',
    'sDOT': 'polkadot',
    'sMATIC': 'matic-network',
    'sLINK': 'chainlink',
    'sUNI': 'uniswap',
    'sAAPL': 'apple',
    'sTSLA': 'tesla'
  };
  
  return symbolToId[symbol] || symbol.toLowerCase().replace('s', '');
};

// Custom tooltip for the chart
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 p-2 rounded shadow-lg">
        <p className="text-gray-300">{`Date: ${label}`}</p>
        <p className="text-blue-400">{`Price: $${payload[0].value.toFixed(2)}`}</p>
      </div>
    );
  }
  return null;
};

// Main app component
export default function SynthXApp() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [syntheticAssets, setSyntheticAssets] = useState(initialAssets);
  const [selectedAsset, setSelectedAsset] = useState(initialAssets[0]);
  const [timeframe, setTimeframe] = useState('1D');
  const [tradeType, setTradeType] = useState('market');
  const [orderType, setOrderType] = useState('buy');
  const [orderValue, setOrderValue] = useState('');
  const [leverage, setLeverage] = useState(5);
  const [priceHistory, setPriceHistory] = useState([]);
  const [orderbook, setOrderbook] = useState({ asks: [], bids: [] });
  const [recentTrades, setRecentTrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch assets from CoinGecko
  useEffect(() => {
    const fetchAssets = async () => {
      setIsLoading(true);
      try {
        const data = await fetchCoinGeckoData();
        if (data && data.length > 0) {
          const mappedAssets = data.map(coin => ({
            symbol: `s${coin.symbol.toUpperCase()}`,
            name: `Synthetic ${coin.name}`,
            price: coin.current_price,
            change24h: coin.price_change_percentage_24h,
            volume: coin.total_volume,
            id: coin.id
          }));
          
          setSyntheticAssets(mappedAssets);
          setSelectedAsset(mappedAssets[0]);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error in fetchAssets:', error);
        setErrorMessage('Failed to load assets. Please try again later.');
        setIsLoading(false);
      }
    };
    
    fetchAssets();
  }, []);
  
  // Fetch price history whenever selected asset changes
  useEffect(() => {
    const fetchHistory = async () => {
      if (selectedAsset) {
        try {
          const coinId = selectedAsset.id || getCoinGeckoId(selectedAsset.symbol);
          const history = await fetchPriceHistory(coinId);
          setPriceHistory(history);
          
          // Generate orderbook and recent trades based on current price
          if (selectedAsset.price) {
            setOrderbook(generateOrderbook(selectedAsset.price));
            setRecentTrades(generateRecentTrades(selectedAsset.price));
          }
        } catch (error) {
          console.error('Error fetching price history:', error);
        }
      }
    };
    
    fetchHistory();
  }, [selectedAsset]);
  
  // Filter assets based on search query
  const filteredAssets = syntheticAssets.filter(asset => 
    asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
    asset.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle timeframe change
  const handleTimeframeChange = async (tf) => {
    setTimeframe(tf);
    
    if (selectedAsset) {
      let days = 1;
      
      // Map timeframe to days
      switch(tf) {
        case '5m': days = 1; break;
        case '15m': days = 1; break;
        case '1H': days = 1; break;
        case '4H': days = 1; break;
        case '1D': days = 1; break;
        case '1W': days = 7; break;
        case '1M': days = 30; break;
        default: days = 1;
      }
      
      try {
        const coinId = selectedAsset.id || getCoinGeckoId(selectedAsset.symbol);
        const history = await fetchPriceHistory(coinId, days);
        setPriceHistory(history);
      } catch (error) {
        console.error('Error fetching price history:', error);
      }
    }
  };
  
  // Handle refresh button click
  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const data = await fetchCoinGeckoData();
      if (data && data.length > 0) {
        const mappedAssets = data.map(coin => ({
          symbol: `s${coin.symbol.toUpperCase()}`,
          name: `Synthetic ${coin.name}`,
          price: coin.current_price,
          change24h: coin.price_change_percentage_24h,
          volume: coin.total_volume,
          id: coin.id
        }));
        
        setSyntheticAssets(mappedAssets);
        
        // Update selected asset with fresh data
        const updatedSelectedAsset = mappedAssets.find(asset => asset.symbol === selectedAsset.symbol) || mappedAssets[0];
        setSelectedAsset(updatedSelectedAsset);
        
        // Update price history
        const coinId = updatedSelectedAsset.id || getCoinGeckoId(updatedSelectedAsset.symbol);
        const history = await fetchPriceHistory(coinId);
        setPriceHistory(history);
        
        // Update orderbook and recent trades
        setOrderbook(generateOrderbook(updatedSelectedAsset.price));
        setRecentTrades(generateRecentTrades(updatedSelectedAsset.price));
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error in handleRefresh:', error);
      setErrorMessage('Failed to refresh data. Please try again later.');
      setIsLoading(false);
    }
  };

  // Generate fallback chart data if no price history is available
  const fallbackData = [
    { date: "2023-01-01", price: 1000 },
    { date: "2023-01-02", price: 1050 },
    { date: "2023-01-03", price: 1025 },
    { date: "2023-01-04", price: 1075 },
    { date: "2023-01-05", price: 1100 },
  ];
  
  const chartData = priceHistory.length > 0 ? priceHistory : fallbackData;

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <button onClick={handleRefresh} className="hover:text-blue-400">
              <RefreshCw className={`text-blue-400 ${isLoading ? 'animate-spin' : ''}`} size={24} />
            </button>
            <h1 className="text-xl font-bold">SynthX</h1>
          </div>
          
          <div className="hidden md:flex space-x-6">
            <button className="hover:text-blue-400">Exchange</button>
            <button className="hover:text-blue-400">Markets</button>
            <button className="hover:text-blue-400">Derivatives</button>
            <button className="hover:text-blue-400">Earn</button>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm">
              Connect Wallet
            </button>
            <Settings className="hover:text-blue-400 cursor-pointer" size={20} />
            <User className="hover:text-blue-400 cursor-pointer" size={20} />
            
            <button 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="mt-4 md:hidden flex flex-col space-y-3">
            <button className="hover:text-blue-400 py-2">Exchange</button>
            <button className="hover:text-blue-400 py-2">Markets</button>
            <button className="hover:text-blue-400 py-2">Derivatives</button>
            <button className="hover:text-blue-400 py-2">Earn</button>
          </div>
        )}
      </header>
      
      {/* Error message */}
      {errorMessage && (
        <div className="bg-red-600 p-2 text-center">
          {errorMessage}
          <button onClick={() => setErrorMessage('')} className="ml-2 font-bold">×</button>
        </div>
      )}
      
      {/* Main content */}
      <div className="flex flex-col lg:flex-row flex-1">
        {/* Left sidebar - Asset list */}
        <div className="w-full lg:w-64 bg-gray-800 border-r border-gray-700 overflow-auto">
          <div className="p-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search assets..." 
                className="w-full bg-gray-700 px-4 py-2 rounded-lg text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="px-2">
            <div className="grid grid-cols-4 text-xs text-gray-400 py-2 px-2">
              <div>Pair</div>
              <div className="text-right">Price</div>
              <div className="text-right">24h</div>
              <div className="text-right">Volume</div>
            </div>
            
            {isLoading ? (
              <div className="text-center py-4 text-gray-400">Loading assets...</div>
            ) : filteredAssets.length > 0 ? (
              filteredAssets.map(asset => (
                <button 
                  key={asset.symbol}
                  className={`w-full grid grid-cols-4 text-sm py-3 px-2 hover:bg-gray-700 rounded-lg ${
                    selectedAsset.symbol === asset.symbol ? 'bg-gray-700' : ''
                  }`}
                  onClick={() => setSelectedAsset(asset)}
                >
                  <div className="font-medium">{asset.symbol}</div>
                  <div className="text-right">${asset.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</div>
                  <div className={`text-right ${asset.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {asset.change24h >= 0 ? '+' : ''}{asset.change24h?.toFixed(2) || '0.00'}%
                  </div>
                  <div className="text-right text-gray-400">
                    ${asset.volume ? (asset.volume / 1000000).toFixed(1) + 'M' : '0M'}
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-4 text-gray-400">No assets found</div>
            )}
          </div>
        </div>
        
        {/* Main trading area */}
        <div className="flex-1 flex flex-col">
          {/* Trading header */}
          <div className="p-4 border-b border-gray-700 flex flex-col md:flex-row justify-between">
            <div className="flex items-center">
              <div className="mr-4">
                <h2 className="text-xl font-bold">{selectedAsset.symbol}</h2>
                <div className="text-sm text-gray-400">{selectedAsset.name}</div>
              </div>
              
              <div>
                <div className="text-2xl font-bold">
                  ${selectedAsset.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                </div>
                <div className={`text-sm ${selectedAsset.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {selectedAsset.change24h >= 0 ? '+' : ''}{selectedAsset.change24h?.toFixed(2) || '0.00'}% (24h)
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2 mt-4 md:mt-0">
              {['5m', '15m', '1H', '4H', '1D', '1W', '1M'].map(tf => (
                <button 
                  key={tf}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    timeframe === tf ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  onClick={() => handleTimeframeChange(tf)}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
          
          {/* Chart and trading interface */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
            {/* Chart area - 2/3 of the space */}
            <div className="lg:col-span-2 bg-gray-800 rounded-lg p-4">
              <div className="h-96 flex items-center justify-center border border-gray-700 rounded-lg">
                {isLoading ? (
                  <div className="flex items-center justify-center text-gray-400">
                    Loading chart data...
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#9CA3AF"
                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      />
                      <YAxis 
                        stroke="#9CA3AF"
                        domain={['auto', 'auto']}
                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                        width={60}
                        tickFormatter={(value) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#3B82F6" 
                        strokeWidth={2} 
                        dot={false}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
            
            {/* Trading panel - 1/3 of the space */}
            <div className="lg:col-span-1 bg-gray-800 rounded-lg p-4">
              <div className="flex mb-4">
                <button 
                  className={`flex-1 py-2 text-center rounded-l-lg ${
                    orderType === 'buy' ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  onClick={() => setOrderType('buy')}
                >
                  Buy / Long
                </button>
                <button 
                  className={`flex-1 py-2 text-center rounded-r-lg ${
                    orderType === 'sell' ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  onClick={() => setOrderType('sell')}
                >
                  Sell / Short
                </button>
              </div>
              
              <div className="flex mb-4">
                <button 
                  className={`flex-1 py-2 text-center rounded-l-lg ${
                    tradeType === 'market' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  onClick={() => setTradeType('market')}
                >
                  Market
                </button>
                <button 
                  className={`flex-1 py-2 text-center rounded-r-lg ${
                    tradeType === 'limit' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  onClick={() => setTradeType('limit')}
                >
                  Limit
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-1">Price (USDC)</label>
                <input 
                  type="text" 
                  value={tradeType === 'market' ? 'Market Price' : selectedAsset.price?.toFixed(2) || '0.00'}
                  disabled={tradeType === 'market'}
                  className="w-full bg-gray-700 p-3 rounded-lg"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-1">Amount ({selectedAsset.symbol})</label>
                <input 
                  type="text" 
                  value={orderValue}
                  onChange={(e) => setOrderValue(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-gray-700 p-3 rounded-lg"
                />
                <div className="flex justify-between text-sm text-gray-400 mt-1">
                  <span>≈ ${orderValue && selectedAsset.price ? (parseFloat(orderValue) * selectedAsset.price).toFixed(2) : '0.00'}</span>
                  <span>Balance: 0.00 USDC</span>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-1">Leverage: {leverage}x</label>
                <input 
                  type="range" 
                  min="1" 
                  max="50" 
                  value={leverage}
                  onChange={(e) => setLeverage(e.target.value)}
                  className="w-full accent-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>1x</span>
                  <span>10x</span>
                  <span>25x</span>
                  <span>50x</span>
                </div>
              </div>
              
              <button 
                className={`w-full py-3 rounded-lg font-bold ${
                  orderType === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {orderType === 'buy' ? 'Buy / Long' : 'Sell / Short'} {selectedAsset.symbol}
              </button>
            </div>
          </div>
          
          {/* Bottom panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {/* Orderbook */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3">Order Book</h3>
              
              <div className="grid grid-cols-3 text-xs text-gray-400 mb-2">
                <div>Price (USDC)</div>
                <div className="text-right">Amount ({selectedAsset.symbol})</div>
                <div className="text-right">Total (USDC)</div>
              </div>
              
              {/* Asks (Sells) */}
              <div className="mb-4">
                {orderbook.asks.slice().reverse().map((order, i) => (
                  <div key={`ask-${i}`} className="grid grid-cols-3 text-sm py-1">
                    <div className="text-red-500">{order.price}</div>
                    <div className="text-right text-gray-300">{order.amount}</div>
                    <div className="text-right text-gray-400">{order.total}</div>
                  </div>
                ))}
              </div>
              
              {/* Current price indicator */}
              <div className="border-y border-gray-700 py-2 mb-2 flex justify-between text-sm">
                <span className="font-medium">${selectedAsset.price?.toFixed(2) || '0.00'}</span>
                <span className={selectedAsset.change24h >= 0 ? 'text-green-500' : 'text-red-500'}>
                  {selectedAsset.change24h >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                </span>
              </div>
              
              {/* Bids (Buys) */}
              <div>
                {orderbook.bids.map((order, i) => (
                  <div key={`bid-${i}`} className="grid grid-cols-3 text-sm py-1">
                    <div className="text-green-500">{order.price}</div>
                    <div className="text-right text-gray-300">{order.amount}</div>
                    <div className="text-right text-gray-400">{order.total}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Recent trades */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3">Recent Trades</h3>
              
              <div className="grid grid-cols-3 text-xs text-gray-400 mb-2">
                <div>Price (USDC)</div>
                <div className="text-right">Amount ({selectedAsset.symbol})</div>
                <div className="text-right">Time</div>
              </div>
              
              {recentTrades.map((trade, i) => (
                <div key={`trade-${i}`} className="grid grid-cols-3 text-sm py-1">
                  <div className={trade.type === 'buy' ? 'text-green-500' : 'text-red-500'}>
                    {trade.price}
                  </div>
                  <div className="text-right text-gray-300">{trade.amount}</div>
                  <div className="text-right text-gray-400">{trade.time}</div>
                </div>
              ))}
            </div>
            
            {/* Open positions */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3">Your Positions</h3>
              
              <div className="grid grid-cols-4 text-xs text-gray-400 mb-2">
                <div>Asset</div>
                <div className="text-right">Size</div>
                <div className="text-right">Entry</div>
                <div className="text-right">PnL</div>
              </div>
              
              <div className="text-sm text-center text-gray-400 py-8">
                No open positions
              </div>
              
              <h3 className="text-lg font-medium mb-3 mt-6">Open Orders</h3>
              
              <div className="grid grid-cols-4 text-xs text-gray-400 mb-2">
                <div>Type</div>
                <div className="text-right">Price</div>
                <div className="text-right">Amount</div>
                <div className="text-right">Action</div>
              </div>
              
              <div className="text-sm text-center text-gray-400 py-8">
                No open orders
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 p-4 text-sm text-gray-400">
        <div className="flex justify-between items-center">
          <div>
            SynthX - Decentralized Synthetic Asset Exchange on Arweave/AO
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-blue-400">Terms</a>
            <a href="#" className="hover:text-blue-400">Privacy</a>
            <a href="#" className="hover:text-blue-400">Docs</a>
          </div>
        </div>
        </footer>
        </div>
    );
}           