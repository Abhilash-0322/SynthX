# SynthX - Decentralized Synthetic Asset Exchange

![SynthX Banner](https://ik.imagekit.io/w7ndnl04z/Screenshot_20250430_173920.png?updatedAt=1746014996413)

## Overview

SynthX is a decentralized perpetual exchange built on Arweave/AO that allows users to trade synthetic assets. These assets mimic the price of cryptocurrencies, stocks, commodities, and forex without requiring users to hold the actual underlying assets. This innovative approach provides seamless exposure to various markets within a single platform.

## Features

- **Synthetic Asset Trading**: Trade synthetic versions of popular assets like BTC, ETH, Gold, Tesla, and more
- **Perpetual Futures**: Long or short positions with adjustable leverage up to 50x
- **Decentralized Architecture**: Built on Arweave/AO for true decentralization and censorship resistance
- **User-Friendly Interface**: Professional trading interface with TradingView-style charts
- **Advanced Order Types**: Market, limit, stop-loss, and take-profit orders
- **Real-Time Order Book**: View market depth and liquidity at a glance
- **Position Management**: Track and manage all your open positions and orders
- **Mobile Responsive**: Trade from any device with a fully responsive design

## Tech Stack

- **Frontend**: React, Tailwind CSS
- **Smart Contracts**: Arweave/AO
- **Price Oracles**: Chainlink/Arweave oracle solutions
- **State Management**: React Context API / Redux
- **Charting**: Custom lightweight charting system
- **Wallet Connection**: Support for multiple web3 wallets

## Installation

```bash
# Clone the repository
git clone https://github.com/Abhilash-0322/Synthx.git

# Navigate to project directory
cd Synthx

# Install dependencies
npm install

# Start development server
npm run dev
```

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```
REACT_APP_AO_NODE_URL=your_arweave_node_url
REACT_APP_ORACLE_ADDRESS=your_oracle_contract_address
REACT_APP_EXCHANGE_CONTRACT=your_exchange_contract_address
```

## Smart Contract Architecture

SynthX utilizes a system of smart contracts on the Arweave/AO network:

1. **SynthToken Contracts**: For creating and managing synthetic assets
2. **Exchange Contract**: Handles order matching and execution
3. **Oracle Contract**: Fetches and validates price data for underlying assets
4. **Liquidity Pool Contract**: Manages collateral and liquidity
5. **Governance Contract**: Handles protocol upgrades and parameters

## Oracle System

The oracle system is critical for providing accurate price data for synthetic assets. SynthX uses a decentralized oracle network that:

- Aggregates price data from multiple sources
- Applies statistical methods to filter out outliers
- Updates prices on-chain at regular intervals
- Includes fail-safe mechanisms to prevent price manipulation

## Trading Flow

1. User connects wallet to the platform
2. User selects a synthetic asset to trade
3. User specifies trade parameters (buy/sell, amount, leverage, order type)
4. Order is sent to the Arweave/AO network
5. Smart contracts execute the trade
6. Position is opened and visible in the user's dashboard

## Screenshots

![Trading Interface](https://ik.imagekit.io/w7ndnl04z/Screenshot_20250430_173328.png?updatedAt=1746014761369)
*Main trading interface with chart, orderbook and trading panel*

![Position Management](https://ik.imagekit.io/w7ndnl04z/Screenshot_20250430_173705.png?updatedAt=1746014842446)
*Position management dashboard*

## Roadmap

- [ ] **Q2 2025**: Public testnet launch
- [ ] **Q3 2025**: Mainnet launch with initial synthetic cryptocurrencies
- [ ] **Q4 2025**: Addition of synthetic stocks and commodities
- [ ] **Q1 2026**: Introduction of governance token and DAO
- [ ] **Q2 2026**: Cross-chain integration for collateral deposits
- [ ] **Q3 2026**: Advanced trading features (portfolio margin, advanced order types)

## Contributing

We welcome contributions to SynthX! Please see our [contributing guidelines](CONTRIBUTING.md) for more information.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a pull request

## Security

SynthX takes security seriously. If you discover a security vulnerability, please send an email to security@synthx.io. Do not disclose security issues publicly until they have been handled by the team.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

- Website: [synthx.io](https://synthx.io)
- Twitter: [@SynthX_io](https://twitter.com/SynthX_io)
- Discord: [SynthX Community](https://discord.gg/synthx)
- Email: info@synthx.io

## Disclaimer

SynthX is a decentralized trading platform that allows users to gain exposure to the price movements of various assets without holding the underlying assets. Trading synthetic assets involves significant risk. The platform is in development and should be used with caution. Always do your own research and never trade with funds you cannot afford to lose.