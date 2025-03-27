"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTranslation } from "@/context/translation-context"
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts"
import { Star, Plus, TrendingUp, TrendingDown, Search, AlertCircle } from "lucide-react"
import { StockDetail } from "@/components/stock-detail"
import { AddToWatchlist } from "@/components/add-to-watchlist"
import { useToast } from "@/components/ui/use-toast"

// Mock data for all available stocks
export const allStocksData = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 178.72,
    change: 2.34,
    changePercent: 1.32,
    volume: "52.3M",
    marketCap: "2.85T",
    peRatio: 29.4,
    dividend: 0.92,
    sector: "Technology",
    chartData: [
      { value: 175 },
      { value: 176 },
      { value: 174 },
      { value: 177 },
      { value: 176 },
      { value: 178 },
      { value: 178.72 },
    ],
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 378.33,
    change: 4.51,
    changePercent: 1.21,
    volume: "28.7M",
    marketCap: "2.81T",
    peRatio: 32.8,
    dividend: 0.68,
    sector: "Technology",
    chartData: [
      { value: 370 },
      { value: 372 },
      { value: 375 },
      { value: 374 },
      { value: 376 },
      { value: 377 },
      { value: 378.33 },
    ],
  },
  {
    symbol: "TSLA",
    name: "Tesla, Inc.",
    price: 235.45,
    change: -5.67,
    changePercent: -2.35,
    volume: "64.8M",
    marketCap: "748.2B",
    peRatio: 84.1,
    dividend: 0,
    sector: "Automotive",
    chartData: [
      { value: 245 },
      { value: 243 },
      { value: 240 },
      { value: 238 },
      { value: 237 },
      { value: 236 },
      { value: 235.45 },
    ],
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    price: 487.21,
    change: 12.34,
    changePercent: 2.6,
    volume: "42.1M",
    marketCap: "1.2T",
    peRatio: 72.3,
    dividend: 0.16,
    sector: "Technology",
    chartData: [
      { value: 470 },
      { value: 475 },
      { value: 478 },
      { value: 480 },
      { value: 483 },
      { value: 485 },
      { value: 487.21 },
    ],
  },
  {
    symbol: "AMZN",
    name: "Amazon.com, Inc.",
    price: 146.88,
    change: 2.05,
    changePercent: 1.42,
    volume: "31.2M",
    marketCap: "1.52T",
    peRatio: 56.7,
    dividend: 0,
    sector: "Consumer Cyclical",
    chartData: [
      { value: 143 },
      { value: 144 },
      { value: 145 },
      { value: 144.5 },
      { value: 145.5 },
      { value: 146 },
      { value: 146.88 },
    ],
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 134.99,
    change: -1.23,
    changePercent: -0.91,
    volume: "19.5M",
    marketCap: "1.68T",
    peRatio: 25.8,
    dividend: 0,
    sector: "Technology",
    chartData: [
      { value: 137 },
      { value: 136.5 },
      { value: 136 },
      { value: 135.5 },
      { value: 135 },
      { value: 134.5 },
      { value: 134.99 },
    ],
  },
  {
    symbol: "META",
    name: "Meta Platforms, Inc.",
    price: 327.56,
    change: 5.23,
    changePercent: 1.62,
    volume: "22.9M",
    marketCap: "837.4B",
    peRatio: 28.1,
    dividend: 0,
    sector: "Technology",
    chartData: [
      { value: 320 },
      { value: 322 },
      { value: 324 },
      { value: 325 },
      { value: 326 },
      { value: 327 },
      { value: 327.56 },
    ],
  },
  {
    symbol: "NFLX",
    name: "Netflix, Inc.",
    price: 567.89,
    change: 8.76,
    changePercent: 1.57,
    volume: "15.3M",
    marketCap: "248.6B",
    peRatio: 47.2,
    dividend: 0,
    sector: "Communication Services",
    chartData: [
      { value: 555 },
      { value: 558 },
      { value: 560 },
      { value: 562 },
      { value: 565 },
      { value: 566 },
      { value: 567.89 },
    ],
  },
  {
    symbol: "JPM",
    name: "JPMorgan Chase & Co.",
    price: 182.43,
    change: 1.87,
    changePercent: 1.04,
    volume: "8.7M",
    marketCap: "524.8B",
    peRatio: 11.2,
    dividend: 4.2,
    sector: "Financial Services",
    chartData: [
      { value: 179 },
      { value: 180 },
      { value: 181 },
      { value: 180.5 },
      { value: 181.5 },
      { value: 182 },
      { value: 182.43 },
    ],
  },
  {
    symbol: "V",
    name: "Visa Inc.",
    price: 275.64,
    change: 3.21,
    changePercent: 1.18,
    volume: "6.2M",
    marketCap: "567.3B",
    peRatio: 30.5,
    dividend: 1.8,
    sector: "Financial Services",
    chartData: [
      { value: 270 },
      { value: 271 },
      { value: 272 },
      { value: 273 },
      { value: 274 },
      { value: 275 },
      { value: 275.64 },
    ],
  },
  {
    symbol: "WMT",
    name: "Walmart Inc.",
    price: 58.32,
    change: 0.45,
    changePercent: 0.78,
    volume: "7.1M",
    marketCap: "469.2B",
    peRatio: 30.6,
    dividend: 1.9,
    sector: "Consumer Defensive",
    chartData: [
      { value: 57.5 },
      { value: 57.7 },
      { value: 57.9 },
      { value: 58.0 },
      { value: 58.1 },
      { value: 58.2 },
      { value: 58.32 },
    ],
  },
  {
    symbol: "JNJ",
    name: "Johnson & Johnson",
    price: 152.76,
    change: -0.87,
    changePercent: -0.57,
    volume: "5.8M",
    marketCap: "367.5B",
    peRatio: 17.2,
    dividend: 3.2,
    sector: "Healthcare",
    chartData: [
      { value: 154 },
      { value: 153.8 },
      { value: 153.5 },
      { value: 153.2 },
      { value: 153 },
      { value: 152.8 },
      { value: 152.76 },
    ],
  },
  {
    symbol: "PG",
    name: "Procter & Gamble Co.",
    price: 162.45,
    change: 1.23,
    changePercent: 0.76,
    volume: "4.9M",
    marketCap: "382.7B",
    peRatio: 26.8,
    dividend: 2.5,
    sector: "Consumer Defensive",
    chartData: [
      { value: 160 },
      { value: 160.5 },
      { value: 161 },
      { value: 161.5 },
      { value: 162 },
      { value: 162.2 },
      { value: 162.45 },
    ],
  },
  {
    symbol: "INTC",
    name: "Intel Corporation",
    price: 34.21,
    change: -0.87,
    changePercent: -2.48,
    volume: "32.7M",
    marketCap: "144.3B",
    peRatio: 17.6,
    dividend: 1.5,
    sector: "Technology",
    chartData: [
      { value: 36 },
      { value: 35.5 },
      { value: 35 },
      { value: 34.8 },
      { value: 34.5 },
      { value: 34.3 },
      { value: 34.21 },
    ],
  },
]

export function MarketWatchlist() {
  const [searchTerm, setSearchTerm] = useState("")
  const [watchlist, setWatchlist] = useState<string[]>([])
  const [selectedStock, setSelectedStock] = useState<any>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const { t } = useTranslation()
  const { toast } = useToast()

  // Load watchlist from localStorage on component mount
  useEffect(() => {
    const savedWatchlist = localStorage.getItem("watchlist")
    if (savedWatchlist) {
      try {
        setWatchlist(JSON.parse(savedWatchlist))
      } catch (e) {
        console.error("Failed toparse watchlist from localStorage", e)
        setWatchlist([])
      }
    } else {
      // Set default watchlist for first-time users
      const defaultWatchlist = ["AAPL", "MSFT", "NVDA", "AMZN", "TSLA"]
      setWatchlist(defaultWatchlist)
      localStorage.setItem("watchlist", JSON.stringify(defaultWatchlist))
    }
  }, [])

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist))
  }, [watchlist])

  // Filter watchlist based on search term
  const filteredWatchlist = allStocksData
    .filter((stock) => watchlist.includes(stock.symbol))
    .filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )

  // Toggle stock in watchlist
  const toggleWatchlist = (symbol: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation() // Prevent row click when clicking the star button
    }

    if (watchlist.includes(symbol)) {
      // Remove from watchlist
      setWatchlist((prev) => prev.filter((item) => item !== symbol))
      toast({
        title: t("removedFromWatchlist"),
        description: `${symbol} ${t("hasBeenRemovedFromWatchlist")}`,
      })
    } else {
      // Add to watchlist
      setWatchlist((prev) => [...prev, symbol])
      toast({
        title: t("addedToWatchlist"),
        description: `${symbol} ${t("hasBeenAddedToWatchlist")}`,
      })
    }
  }

  // Handle stock selection for detailed view
  const handleSelectStock = (stock: any) => {
    setSelectedStock(stock)
  }

  // Handle adding a new stock to watchlist
  const handleAddToWatchlist = (symbol: string) => {
    if (!watchlist.includes(symbol)) {
      setWatchlist((prev) => [...prev, symbol])
      toast({
        title: t("addedToWatchlist"),
        description: `${symbol} ${t("hasBeenAddedToWatchlist")}`,
      })
    }
    setShowAddDialog(false)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
            <div>
              <CardTitle>{t("watchlist")}</CardTitle>
              <CardDescription>{t("trackFavoriteStocks")}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("searchWatchlist")}
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" onClick={() => setShowAddDialog(true)} title={t("addToWatchlist")}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredWatchlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">{searchTerm ? t("noMatchingStocks") : t("emptyWatchlist")}</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? t("tryDifferentSearch") : t("addStocksToWatchlist")}
              </p>
              {!searchTerm && (
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  {t("addStocks")}
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>{t("symbol")}</TableHead>
                    <TableHead>{t("name")}</TableHead>
                    <TableHead className="text-right">{t("price")}</TableHead>
                    <TableHead className="text-right">{t("change")}</TableHead>
                    <TableHead className="text-right">{t("changePercent")}</TableHead>
                    <TableHead>{t("chart")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWatchlist.map((stock) => (
                    <TableRow
                      key={stock.symbol}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSelectStock(stock)}
                    >
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => toggleWatchlist(stock.symbol, e)}
                        >
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium">{stock.symbol}</TableCell>
                      <TableCell>{stock.name}</TableCell>
                      <TableCell className="text-right">${stock.price.toFixed(2)}</TableCell>
                      <TableCell className={`text-right ${stock.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {stock.change >= 0 ? "+" : ""}
                        {stock.change.toFixed(2)}
                      </TableCell>
                      <TableCell
                        className={`text-right ${stock.changePercent >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        <div className="flex items-center justify-end">
                          {stock.changePercent >= 0 ? (
                            <TrendingUp className="mr-1 h-4 w-4" />
                          ) : (
                            <TrendingDown className="mr-1 h-4 w-4" />
                          )}
                          {stock.changePercent >= 0 ? "+" : ""}
                          {stock.changePercent.toFixed(2)}%
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="h-10 w-24">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stock.chartData}>
                              <Tooltip
                                content={({ active, payload }) => {
                                  if (active && payload && payload.length) {
                                    return (
                                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                                        <div className="text-xs">${payload[0].value}</div>
                                      </div>
                                    )
                                  }
                                  return null
                                }}
                              />
                              <Line
                                type="monotone"
                                dataKey="value"
                                stroke={stock.changePercent >= 0 ? "#10b981" : "#ef4444"}
                                strokeWidth={2}
                                dot={false}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stock Detail Dialog */}
      {selectedStock && (
        <StockDetail
          stock={selectedStock}
          onClose={() => setSelectedStock(null)}
          isInWatchlist={watchlist.includes(selectedStock.symbol)}
          onToggleWatchlist={() => toggleWatchlist(selectedStock.symbol)}
        />
      )}

      {/* Add to Watchlist Dialog */}
      {showAddDialog && (
        <AddToWatchlist
          onClose={() => setShowAddDialog(false)}
          onAddStock={handleAddToWatchlist}
          currentWatchlist={watchlist}
        />
      )}
    </>
  )
}

