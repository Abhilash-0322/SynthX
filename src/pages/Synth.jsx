import { useState, useEffect } from 'react';
import { TrendingUp, BarChart2, DollarSign, Clock, Settings, User, Menu, X, ChevronDown, RefreshCw, ArrowUp, ArrowDown } from 'lucide-react';

// Mock data
const syntheticAssets = [
  { symbol: 'sBTC', name: 'Synthetic Bitcoin', price: 59874.32, change24h: 2.34, volume: 1243500000 },
  { symbol: 'sETH', name: 'Synthetic Ethereum', price: 3241.76, change24h: 1.87, volume: 754300000 },
  { symbol: 'sSOL', name: 'Synthetic Solana', price: 148.23, change24h: 5.12, volume: 423100000 },
  { symbol: 'sGOLD', name: 'Synthetic Gold', price: 2367.42, change24h: -0.54, volume: 321700000 },
  { symbol: 'sTSLA', name: 'Synthetic Tesla', price: 187.54, change24h: -1.23, volume: 198400000 },
  { symbol: 'sAPPL', name: 'Synthetic Apple', price: 176.32, change24h: 0.87, volume: 245600000 },
  { symbol: 'sEUR', name: 'Synthetic Euro', price: 1.08, change24h: 0.12, volume: 532100000 },
  { symbol: 'sJPY', name: 'Synthetic Japanese Yen', price: 0.0066, change24h: -0.32, volume: 143700000 },
];

// Price history mock data for chart
const generatePriceHistory = (basePrice, days = 30) => {
  const prices = [];
  let price = basePrice;
  for (let i = 0; i < days; i++) {
    price = price * (1 + (Math.random() * 0.06 - 0.03));
    prices.push({
      date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      price: price
    });
  }
  return prices;
};

// Mock orderbook data
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

// Main app component
export default function SynthXApp() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(syntheticAssets[0]);
  const [timeframe, setTimeframe] = useState('1D');
  const [tradeType, setTradeType] = useState('market');
  const [orderType, setOrderType] = useState('buy');
  const [orderValue, setOrderValue] = useState('');
  const [leverage, setLeverage] = useState(5);
  
  // Generate mock data based on selected asset
  const priceHistory = generatePriceHistory(selectedAsset.price);
  const orderbook = generateOrderbook(selectedAsset.price);
  const recentTrades = generateRecentTrades(selectedAsset.price);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <RefreshCw className="text-blue-400" size={24} />
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
            
            {syntheticAssets.map(asset => (
              <button 
                key={asset.symbol}
                className={`w-full grid grid-cols-4 text-sm py-3 px-2 hover:bg-gray-700 rounded-lg ${
                  selectedAsset.symbol === asset.symbol ? 'bg-gray-700' : ''
                }`}
                onClick={() => setSelectedAsset(asset)}
              >
                <div className="font-medium">{asset.symbol}</div>
                <div className="text-right">${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div className={`text-right ${asset.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                </div>
                <div className="text-right text-gray-400">
                  ${(asset.volume / 1000000).toFixed(1)}M
                </div>
              </button>
            ))}
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
                  ${selectedAsset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className={`text-sm ${selectedAsset.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {selectedAsset.change24h >= 0 ? '+' : ''}{selectedAsset.change24h}% (24h)
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2 mt-4 md:mt-0">
              {['5m', '15m', '1H', '4H', '1D', '1W'].map(tf => (
                <button 
                  key={tf}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    timeframe === tf ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  onClick={() => setTimeframe(tf)}
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
                {/* Simple chart visualization */}
                <div className="w-full h-full flex flex-col justify-between p-4">
                  <div className="text-gray-400 text-sm">Price Chart ({timeframe})</div>
                  <div className="relative flex-1">
                    <div className="absolute inset-0 flex items-end">
                      {priceHistory.map((point, i) => (
                        <div 
                          key={i} 
                          className="flex-1 bg-blue-500 opacity-80 mx-0.5"
                          style={{ 
                            height: `${(point.price / (Math.max(...priceHistory.map(p => p.price)) * 1.2)) * 100}%`,
                            backgroundColor: point.price > priceHistory[Math.max(0, i-1)]?.price ? '#10b981' : '#ef4444'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 flex justify-between mt-2">
                    <span>{priceHistory[0].date}</span>
                    <span>{priceHistory[Math.floor(priceHistory.length / 2)].date}</span>
                    <span>{priceHistory[priceHistory.length - 1].date}</span>
                  </div>
                </div>
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
                  value={tradeType === 'market' ? 'Market Price' : selectedAsset.price.toFixed(2)}
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
                  <span>≈ $0.00</span>
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
                <span className="font-medium">${selectedAsset.price.toFixed(2)}</span>
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