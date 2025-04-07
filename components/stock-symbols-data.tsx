export const stockSymbols = [
  { symbol: "AAPL", name: "Apple Inc.", sector: "Technology" },
  { symbol: "MSFT", name: "Microsoft Corporation", sector: "Technology" },
  { symbol: "GOOGL", name: "Alphabet Inc. (Google)", sector: "Technology" },
  { symbol: "AMZN", name: "Amazon.com Inc.", sector: "Consumer Cyclical" },
  { symbol: "META", name: "Meta Platforms Inc.", sector: "Technology" },
  { symbol: "TSLA", name: "Tesla Inc.", sector: "Automotive" },
  { symbol: "NVDA", name: "NVIDIA Corporation", sector: "Technology" },
  { symbol: "BRK.B", name: "Berkshire Hathaway Inc.", sector: "Financial Services" },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", sector: "Financial Services" },
  { symbol: "JNJ", name: "Johnson & Johnson", sector: "Healthcare" },
  { symbol: "V", name: "Visa Inc.", sector: "Financial Services" },
  { symbol: "PG", name: "Procter & Gamble Co.", sector: "Consumer Defensive" },
  { symbol: "UNH", name: "UnitedHealth Group Inc.", sector: "Healthcare" },
  { symbol: "HD", name: "Home Depot Inc.", sector: "Consumer Cyclical" },
  { symbol: "BAC", name: "Bank of America Corp.", sector: "Financial Services" },
  { symbol: "MA", name: "Mastercard Inc.", sector: "Financial Services" },
  { symbol: "XOM", name: "Exxon Mobil Corporation", sector: "Energy" },
  { symbol: "DIS", name: "Walt Disney Co.", sector: "Communication Services" },
  { symbol: "NFLX", name: "Netflix Inc.", sector: "Communication Services" },
  { symbol: "CSCO", name: "Cisco Systems Inc.", sector: "Technology" },
  { symbol: "ADBE", name: "Adobe Inc.", sector: "Technology" },
  { symbol: "PFE", name: "Pfizer Inc.", sector: "Healthcare" },
  { symbol: "CRM", name: "Salesforce Inc.", sector: "Technology" },
  { symbol: "CMCSA", name: "Comcast Corporation", sector: "Communication Services" },
  { symbol: "COST", name: "Costco Wholesale Corporation", sector: "Consumer Defensive" },
  { symbol: "ABT", name: "Abbott Laboratories", sector: "Healthcare" },
  { symbol: "TMO", name: "Thermo Fisher Scientific Inc.", sector: "Healthcare" },
  { symbol: "AVGO", name: "Broadcom Inc.", sector: "Technology" },
  { symbol: "ACN", name: "Accenture plc", sector: "Technology" },
  { symbol: "PEP", name: "PepsiCo Inc.", sector: "Consumer Defensive" },
  { symbol: "NKE", name: "Nike Inc.", sector: "Consumer Cyclical" },
  { symbol: "INTC", name: "Intel Corporation", sector: "Technology" },
  { symbol: "VZ", name: "Verizon Communications Inc.", sector: "Communication Services" },
  { symbol: "MRK", name: "Merck & Co. Inc.", sector: "Healthcare" },
  { symbol: "WMT", name: "Walmart Inc.", sector: "Consumer Defensive" },
  { symbol: "KO", name: "Coca-Cola Company", sector: "Consumer Defensive" },
  { symbol: "MCD", name: "McDonald's Corporation", sector: "Consumer Cyclical" },
  { symbol: "T", name: "AT&T Inc.", sector: "Communication Services" },
  { symbol: "AMD", name: "Advanced Micro Devices Inc.", sector: "Technology" },
  { symbol: "LLY", name: "Eli Lilly and Company", sector: "Healthcare" },
  { symbol: "PYPL", name: "PayPal Holdings Inc.", sector: "Financial Services" },
  { symbol: "ORCL", name: "Oracle Corporation", sector: "Technology" },
  { symbol: "IBM", name: "International Business Machines", sector: "Technology" },
  { symbol: "QCOM", name: "Qualcomm Inc.", sector: "Technology" },
  { symbol: "BA", name: "Boeing Company", sector: "Industrials" },
  { symbol: "GE", name: "General Electric Company", sector: "Industrials" },
  { symbol: "SBUX", name: "Starbucks Corporation", sector: "Consumer Cyclical" },
  { symbol: "MMM", name: "3M Company", sector: "Industrials" },
  { symbol: "CAT", name: "Caterpillar Inc.", sector: "Industrials" },
  { symbol: "GS", name: "Goldman Sachs Group Inc.", sector: "Financial Services" },

  // ETFs
  { symbol: "SPY", name: "SPDR S&P 500 ETF Trust", sector: "ETF" },
  { symbol: "QQQ", name: "Invesco QQQ Trust", sector: "ETF" },
  { symbol: "VTI", name: "Vanguard Total Stock Market ETF", sector: "ETF" },
  { symbol: "VOO", name: "Vanguard S&P 500 ETF", sector: "ETF" },
  { symbol: "VEA", name: "Vanguard FTSE Developed Markets ETF", sector: "ETF" },
  { symbol: "IEFA", name: "iShares Core MSCI EAFE ETF", sector: "ETF" },
  { symbol: "AGG", name: "iShares Core U.S. Aggregate Bond ETF", sector: "ETF" },
  { symbol: "BND", name: "Vanguard Total Bond Market ETF", sector: "ETF" },
  { symbol: "VWO", name: "Vanguard FTSE Emerging Markets ETF", sector: "ETF" },
  { symbol: "IEMG", name: "iShares Core MSCI Emerging Markets ETF", sector: "ETF" },
  { symbol: "VIG", name: "Vanguard Dividend Appreciation ETF", sector: "ETF" },
  { symbol: "VYM", name: "Vanguard High Dividend Yield ETF", sector: "ETF" },
  { symbol: "SCHD", name: "Schwab U.S. Dividend Equity ETF", sector: "ETF" },
  { symbol: "VXUS", name: "Vanguard Total International Stock ETF", sector: "ETF" },
  { symbol: "IJR", name: "iShares Core S&P Small-Cap ETF", sector: "ETF" },
  { symbol: "IVV", name: "iShares Core S&P 500 ETF", sector: "ETF" },
  { symbol: "EFA", name: "iShares MSCI EAFE ETF", sector: "ETF" },
  { symbol: "LQD", name: "iShares iBoxx $ Investment Grade Corporate Bond ETF", sector: "ETF" },
  { symbol: "TLT", name: "iShares 20+ Year Treasury Bond ETF", sector: "ETF" },
  { symbol: "GLD", name: "SPDR Gold Shares", sector: "ETF" },
  { symbol: "VTIP", name: "Vanguard Short-Term Inflation-Protected Securities ETF", sector: "ETF" },
  { symbol: "MUB", name: "iShares National Muni Bond ETF", sector: "ETF" },
  { symbol: "ESGU", name: "iShares ESG Aware MSCI USA ETF", sector: "ETF" },
  { symbol: "ESGD", name: "iShares ESG Aware MSCI EAFE ETF", sector: "ETF" },
  { symbol: "ESGE", name: "iShares ESG Aware MSCI EM ETF", sector: "ETF" },

  // International stocks
  { symbol: "TSM", name: "Taiwan Semiconductor Manufacturing", sector: "Technology" },
  { symbol: "BABA", name: "Alibaba Group Holding Ltd.", sector: "Consumer Cyclical" },
  { symbol: "TCEHY", name: "Tencent Holdings Ltd.", sector: "Communication Services" },
  { symbol: "TM", name: "Toyota Motor Corporation", sector: "Automotive" },
  { symbol: "SAP", name: "SAP SE", sector: "Technology" },
  { symbol: "SONY", name: "Sony Group Corporation", sector: "Technology" },
  { symbol: "BP", name: "BP p.l.c.", sector: "Energy" },
  { symbol: "RY", name: "Royal Bank of Canada", sector: "Financial Services" },
  { symbol: "SHOP", name: "Shopify Inc.", sector: "Technology" },
  { symbol: "NVO", name: "Novo Nordisk A/S", sector: "Healthcare" },

  // Cryptocurrencies (represented as stocks/ETFs)
  { symbol: "GBTC", name: "Grayscale Bitcoin Trust", sector: "Cryptocurrency" },
  { symbol: "ETHE", name: "Grayscale Ethereum Trust", sector: "Cryptocurrency" },
  { symbol: "COIN", name: "Coinbase Global Inc.", sector: "Financial Services" },
  { symbol: "MSTR", name: "MicroStrategy Incorporated", sector: "Technology" },
  { symbol: "RIOT", name: "Riot Platforms Inc.", sector: "Technology" },
  { symbol: "MARA", name: "Marathon Digital Holdings Inc.", sector: "Technology" },

  // Bonds and fixed income
  { symbol: "SHY", name: "iShares 1-3 Year Treasury Bond ETF", sector: "Bond" },
  { symbol: "IEF", name: "iShares 7-10 Year Treasury Bond ETF", sector: "Bond" },
  { symbol: "HYG", name: "iShares iBoxx $ High Yield Corporate Bond ETF", sector: "Bond" },
  { symbol: "JNK", name: "SPDR Bloomberg High Yield Bond ETF", sector: "Bond" },
  { symbol: "VCSH", name: "Vanguard Short-Term Corporate Bond ETF", sector: "Bond" },
  { symbol: "VCIT", name: "Vanguard Intermediate-Term Corporate Bond ETF", sector: "Bond" },

  // Commodities
  { symbol: "USO", name: "United States Oil Fund", sector: "Commodity" },
  { symbol: "SLV", name: "iShares Silver Trust", sector: "Commodity" },
  { symbol: "PPLT", name: "Aberdeen Standard Physical Platinum Shares ETF", sector: "Commodity" },
  { symbol: "PALL", name: "Aberdeen Standard Physical Palladium Shares ETF", sector: "Commodity" },
  { symbol: "DBC", name: "Invesco DB Commodity Index Tracking Fund", sector: "Commodity" },
]

// Function to filter symbols by search term
export const filterSymbols = (searchTerm: string) => {
  if (!searchTerm) return stockSymbols

  const lowerSearchTerm = searchTerm.toLowerCase()
  return stockSymbols.filter(
    (item) =>
      item.symbol.toLowerCase().includes(lowerSearchTerm) ||
      item.name.toLowerCase().includes(lowerSearchTerm) ||
      item.sector.toLowerCase().includes(lowerSearchTerm),
  )
}

// Group symbols by sector
export const getSymbolsBySector = () => {
  const sectors: Record<string, typeof stockSymbols> = {}

  stockSymbols.forEach((stock) => {
    if (!sectors[stock.sector]) {
      sectors[stock.sector] = []
    }
    sectors[stock.sector].push(stock)
  })

  return sectors
}

