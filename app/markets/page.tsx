"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, ArrowUpDown, TrendingUp, TrendingDown, Star } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserNav } from "@/components/user-nav"
import { MainNav } from "@/components/main-nav"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { MarketOverview } from "@/components/market-overview"
import { MarketNews } from "@/components/market-news"
import { MarketWatchlist } from "@/components/market-watchlist"
import { useTranslation } from "@/context/translation-context"
import { Skeleton } from "@/components/ui/skeleton"

export default function MarketsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [marketFilter, setMarketFilter] = useState("all")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()

  // Mock market data
  const markets = [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      price: 178.72,
      change: 2.34,
      changePercent: 1.32,
      volume: "52.3M",
      market: "US",
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corporation",
      price: 378.33,
      change: 4.51,
      changePercent: 1.21,
      volume: "28.7M",
      market: "US",
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      price: 134.99,
      change: -1.23,
      changePercent: -0.91,
      volume: "19.5M",
      market: "US",
    },
    {
      symbol: "AMZN",
      name: "Amazon.com, Inc.",
      price: 146.88,
      change: 2.05,
      changePercent: 1.42,
      volume: "31.2M",
      market: "US",
    },
    {
      symbol: "TSLA",
      name: "Tesla, Inc.",
      price: 235.45,
      change: -5.67,
      changePercent: -2.35,
      volume: "64.8M",
      market: "US",
    },
    {
      symbol: "NVDA",
      name: "NVIDIA Corporation",
      price: 487.21,
      change: 12.34,
      changePercent: 2.6,
      volume: "42.1M",
      market: "US",
    },
    {
      symbol: "META",
      name: "Meta Platforms, Inc.",
      price: 327.56,
      change: 5.23,
      changePercent: 1.62,
      volume: "22.9M",
      market: "US",
    },
    {
      symbol: "NFLX",
      name: "Netflix, Inc.",
      price: 567.89,
      change: 8.76,
      changePercent: 1.57,
      volume: "15.3M",
      market: "US",
    },
    {
      symbol: "BABA",
      name: "Alibaba Group Holding",
      price: 87.65,
      change: -1.45,
      changePercent: -1.63,
      volume: "18.7M",
      market: "ASIA",
    },
    {
      symbol: "ASML",
      name: "ASML Holding",
      price: 645.32,
      change: 10.21,
      changePercent: 1.61,
      volume: "8.2M",
      market: "EU",
    },
    { symbol: "SAP", name: "SAP SE", price: 134.56, change: 2.34, changePercent: 1.77, volume: "5.6M", market: "EU" },
    {
      symbol: "9988.HK",
      name: "Alibaba Group Holding",
      price: 87.65,
      change: -1.45,
      changePercent: -1.63,
      volume: "18.7M",
      market: "ASIA",
    },
    {
      symbol: "7203.T",
      name: "Toyota Motor Corp.",
      price: 2345.0,
      change: 45.0,
      changePercent: 1.96,
      volume: "12.3M",
      market: "ASIA",
    },
    {
      symbol: "RELIANCE.NS",
      name: "Reliance Industries",
      price: 2456.78,
      change: 34.56,
      changePercent: 1.43,
      volume: "9.8M",
      market: "ASIA",
    },
  ]

  // Filter and sort markets
  const filteredMarkets = markets
    .filter(
      (market) =>
        (marketFilter === "all" || market.market === marketFilter) &&
        (market.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
          market.name.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.changePercent - b.changePercent
      } else {
        return b.changePercent - a.changePercent
      }
    })

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
          <h2 className="text-3xl font-bold tracking-tight">{t("markets")}</h2>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                <TrendingUp className="mr-1 h-3 w-3" />
                S&P 500: +1.2%
              </Badge>
              <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                <TrendingDown className="mr-1 h-3 w-3" />
                NASDAQ: -0.3%
              </Badge>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
            <TabsTrigger value="stocks">{t("stocks")}</TabsTrigger>
            <TabsTrigger value="watchlist">{t("watchlist")}</TabsTrigger>
            <TabsTrigger value="news">{t("news")}</TabsTrigger>
          </TabsList>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <TabsContent value="overview" className="space-y-4">
              <MarketOverview />
            </TabsContent>

            <TabsContent value="stocks" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>{t("marketStocks")}</CardTitle>
                  <CardDescription>{t("exploreStocks")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={t("searchSymbolOrCompany")}
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Select value={marketFilter} onValueChange={setMarketFilter}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder={t("selectMarket")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t("allMarkets")}</SelectItem>
                          <SelectItem value="US">{t("usMarket")}</SelectItem>
                          <SelectItem value="EU">{t("europeanMarket")}</SelectItem>
                          <SelectItem value="ASIA">{t("asianMarket")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                      >
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {loading ? (
                    <div className="space-y-3">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>{t("symbol")}</TableHead>
                            <TableHead>{t("name")}</TableHead>
                            <TableHead className="text-right">{t("price")}</TableHead>
                            <TableHead className="text-right">{t("change")}</TableHead>
                            <TableHead className="text-right">{t("changePercent")}</TableHead>
                            <TableHead className="text-right">{t("volume")}</TableHead>
                            <TableHead className="text-center">{t("market")}</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredMarkets.map((market) => (
                            <TableRow key={market.symbol} className="cursor-pointer hover:bg-muted/50">
                              <TableCell className="font-medium">{market.symbol}</TableCell>
                              <TableCell>{market.name}</TableCell>
                              <TableCell className="text-right">${market.price.toFixed(2)}</TableCell>
                              <TableCell
                                className={`text-right ${market.change >= 0 ? "text-green-600" : "text-red-600"}`}
                              >
                                {market.change >= 0 ? "+" : ""}
                                {market.change.toFixed(2)}
                              </TableCell>
                              <TableCell
                                className={`text-right ${market.changePercent >= 0 ? "text-green-600" : "text-red-600"}`}
                              >
                                {market.changePercent >= 0 ? "+" : ""}
                                {market.changePercent.toFixed(2)}%
                              </TableCell>
                              <TableCell className="text-right">{market.volume}</TableCell>
                              <TableCell className="text-center">
                                {market.market === "US" && <Badge variant="outline">US</Badge>}
                                {market.market === "EU" && (
                                  <Badge
                                    variant="outline"
                                    className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                  >
                                    EU
                                  </Badge>
                                )}
                                {market.market === "ASIA" && (
                                  <Badge
                                    variant="outline"
                                    className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                                  >
                                    ASIA
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Star className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="watchlist" className="space-y-4">
              <MarketWatchlist />
            </TabsContent>

            <TabsContent value="news" className="space-y-4">
              <MarketNews />
            </TabsContent>
          </motion.div>
        </Tabs>
      </div>
    </div>
  )
}

