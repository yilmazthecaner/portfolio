"use client"

import { TableCell } from "@/components/ui/table"

import { TableBody } from "@/components/ui/table"

import { TableHead } from "@/components/ui/table"

import { TableRow } from "@/components/ui/table"

import { TableHeader } from "@/components/ui/table"

import { Table } from "@/components/ui/table"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import {
  X,
  Star,
  StarOff,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Calendar,
  Clock,
  Globe,
  ExternalLink,
} from "lucide-react"
import { useTranslation } from "@/context/translation-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

// Mock historical data for stock charts
const generateHistoricalData = (basePrice: number, days: number) => {
  const data = []
  let price = basePrice

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)

    // Random price movement with some trend
    const change = (Math.random() - 0.48) * basePrice * 0.02
    price += change

    data.push({
      date: date.toISOString().split("T")[0],
      price: Number.parseFloat(price.toFixed(2)),
      volume: Math.floor(Math.random() * 10000000) + 1000000,
    })
  }

  return data
}

// Mock news data for the selected stock
const generateStockNews = (symbol: string, name: string) => {
  return [
    {
      id: 1,
      title: `${name} Reports Strong Quarterly Earnings`,
      summary: `${name} (${symbol}) reported quarterly earnings that exceeded analyst expectations, with revenue growing 15% year-over-year.`,
      source: "Financial Times",
      date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      url: "#",
    },
    {
      id: 2,
      title: `Analysts Raise Price Target for ${symbol}`,
      summary: `Several Wall Street analysts have raised their price targets for ${name} following the company's recent product announcements.`,
      source: "Bloomberg",
      date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      url: "#",
    },
    {
      id: 3,
      title: `${name} Announces New Strategic Partnership`,
      summary: `${name} has entered into a strategic partnership with a leading industry player, aiming to expand its market reach.`,
      source: "Reuters",
      date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      url: "#",
    },
  ]
}

interface StockDetailProps {
  stock: any
  onClose: () => void
  isInWatchlist: boolean
  onToggleWatchlist: () => void
}

export function StockDetail({ stock, onClose, isInWatchlist, onToggleWatchlist }: StockDetailProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const { t, language } = useTranslation()

  // Generate historical data for charts
  const historicalData = generateHistoricalData(stock.price, 30)
  const stockNews = generateStockNews(stock.symbol, stock.name)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (overlayRef.current === e.target) onClose()
    }

    document.addEventListener("keydown", handleEscape)
    document.addEventListener("mousedown", handleClickOutside)

    // Lock body scroll
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "auto"
    }
  }, [onClose])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(language === "tr" ? "tr-TR" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatNewsDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString(language === "tr" ? "tr-TR" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <Card>
          <CardHeader className="sticky top-0 z-10 bg-card border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold">{stock.symbol}</h2>
                    <Badge variant="outline" className="bg-muted">
                      {stock.sector}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{stock.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onToggleWatchlist}
                  title={isInWatchlist ? t("removeFromWatchlist") : t("addToWatchlist")}
                >
                  {isInWatchlist ? (
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  ) : (
                    <StarOff className="h-4 w-4" />
                  )}
                </Button>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">${stock.price.toFixed(2)}</span>
                <span className={`flex items-center ${stock.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {stock.change >= 0 ? (
                    <TrendingUp className="mr-1 h-4 w-4" />
                  ) : (
                    <TrendingDown className="mr-1 h-4 w-4" />
                  )}
                  {stock.change >= 0 ? "+" : ""}
                  {stock.change.toFixed(2)} ({stock.changePercent >= 0 ? "+" : ""}
                  {stock.changePercent.toFixed(2)}%)
                </span>
              </div>
              <div className="text-sm text-muted-foreground mt-2 sm:mt-0">
                {t("asOf")}{" "}
                {new Date().toLocaleTimeString(language === "tr" ? "tr-TR" : "en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                <TabsTrigger
                  value="overview"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  {t("overview")}
                </TabsTrigger>
                <TabsTrigger
                  value="chart"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  {t("chart")}
                </TabsTrigger>
                <TabsTrigger
                  value="news"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  {t("news")}
                </TabsTrigger>
                <TabsTrigger
                  value="financials"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  {t("financials")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">{t("keyStatistics")}</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>{t("marketCap")}</span>
                        </div>
                        <span className="font-medium">${stock.marketCap}</span>
                      </div>
                      <Separator />

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-muted-foreground" />
                          <span>{t("peRatio")}</span>
                        </div>
                        <span className="font-medium">{stock.peRatio}</span>
                      </div>
                      <Separator />

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{t("dividend")}</span>
                        </div>
                        <span className="font-medium">
                          {stock.dividend > 0 ? `${stock.dividend}%` : t("noDividend")}
                        </span>
                      </div>
                      <Separator />

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{t("volume")}</span>
                        </div>
                        <span className="font-medium">{stock.volume}</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-medium mt-8 mb-4">{t("aboutCompany")}</h3>
                    <p className="text-muted-foreground">
                      {stock.name} {t("isALeading")} {stock.sector.toLowerCase()} {t("companyDescription")}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">{t("priceHistory")}</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={historicalData.slice(-14)} // Last 14 days
                          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <XAxis
                            dataKey="date"
                            tickFormatter={(date) =>
                              new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric" })
                            }
                          />
                          <YAxis domain={["auto", "auto"]} tickFormatter={(value) => `$${value}`} />
                          <Tooltip
                            formatter={(value: number) => [`$${value}`, t("price")]}
                            labelFormatter={(label) => formatDate(label)}
                            contentStyle={{
                              backgroundColor: "var(--background)",
                              borderColor: "var(--border)",
                              borderRadius: "0.5rem",
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="price"
                            stroke={stock.change >= 0 ? "hsl(var(--chart-primary))" : "hsl(var(--destructive))"}
                            fill={
                              stock.change >= 0 ? "hsl(var(--chart-primary) / 0.2)" : "hsl(var(--destructive) / 0.2)"
                            }
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    <h3 className="text-lg font-medium mt-8 mb-4">{t("latestNews")}</h3>
                    <div className="space-y-4">
                      {stockNews.slice(0, 2).map((news) => (
                        <div key={news.id} className="border rounded-md p-3">
                          <h4 className="font-medium">{news.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{news.summary}</p>
                          <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                            <span>{news.source}</span>
                            <span>{formatNewsDate(news.date)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="chart" className="p-6">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-wrap gap-2 justify-between items-center">
                    <h3 className="text-lg font-medium">{t("priceChart")}</h3>
                    <div className="flex flex-wrap gap-2">
                      {["1W", "1M", "3M", "6M", "1Y", "5Y"].map((period) => (
                        <Badge key={period} variant="outline" className="cursor-pointer hover:bg-muted">
                          {period}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={historicalData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis
                          dataKey="date"
                          tickFormatter={(date) =>
                            new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric" })
                          }
                        />
                        <YAxis domain={["auto", "auto"]} tickFormatter={(value) => `$${value}`} />
                        <Tooltip
                          formatter={(value: number) => [`$${value}`, t("price")]}
                          labelFormatter={(label) => formatDate(label)}
                          contentStyle={{
                            backgroundColor: "var(--background)",
                            borderColor: "var(--border)",
                            borderRadius: "0.5rem",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="price"
                          stroke={stock.change >= 0 ? "hsl(var(--chart-primary))" : "hsl(var(--destructive))"}
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <h3 className="text-lg font-medium mt-4">{t("volumeChart")}</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={historicalData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis
                          dataKey="date"
                          tickFormatter={(date) =>
                            new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric" })
                          }
                        />
                        <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                        <Tooltip
                          formatter={(value: number) => [`${(value / 1000000).toFixed(2)}M`, t("volume")]}
                          labelFormatter={(label) => formatDate(label)}
                          contentStyle={{
                            backgroundColor: "var(--background)",
                            borderColor: "var(--border)",
                            borderRadius: "0.5rem",
                          }}
                        />
                        <Bar dataKey="volume" fill="hsl(var(--chart-secondary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="news" className="p-6">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">{t("latestNewsAndAnalysis")}</h3>

                  {stockNews.map((news) => (
                    <Card key={news.id}>
                      <CardContent className="p-4">
                        <h4 className="text-lg font-medium">{news.title}</h4>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            <span>{news.source}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatNewsDate(news.date)}</span>
                          </div>
                        </div>
                        <p className="mt-4">{news.summary}</p>
                        <div className="mt-4 flex justify-end">
                          <Button variant="ghost" size="sm" className="text-xs">
                            {t("readFullArticle")} <ExternalLink className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <div className="flex justify-center mt-8">
                    <Button variant="outline">{t("loadMoreNews")}</Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="financials" className="p-6">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">{t("financialOverview")}</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{t("revenue")}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">$32.5B</div>
                        <p className="text-sm text-green-600">+15.3% {t("yearOverYear")}</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{t("earnings")}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">$8.2B</div>
                        <p className="text-sm text-green-600">+12.7% {t("yearOverYear")}</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{t("eps")}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">$1.45</div>
                        <p className="text-sm text-green-600">+10.2% {t("yearOverYear")}</p>
                      </CardContent>
                    </Card>
                  </div>

                  <h3 className="text-lg font-medium mt-8">{t("quarterlyResults")}</h3>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t("quarter")}</TableHead>
                          <TableHead className="text-right">{t("revenue")}</TableHead>
                          <TableHead className="text-right">{t("earnings")}</TableHead>
                          <TableHead className="text-right">{t("eps")}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          { quarter: "Q1 2024", revenue: "32.5B", earnings: "8.2B", eps: "1.45" },
                          { quarter: "Q4 2023", revenue: "30.1B", earnings: "7.8B", eps: "1.38" },
                          { quarter: "Q3 2023", revenue: "28.7B", earnings: "7.2B", eps: "1.27" },
                          { quarter: "Q2 2023", revenue: "27.9B", earnings: "6.9B", eps: "1.22" },
                        ].map((row) => (
                          <TableRow key={row.quarter}>
                            <TableCell className="font-medium">{row.quarter}</TableCell>
                            <TableCell className="text-right">${row.revenue}</TableCell>
                            <TableCell className="text-right">${row.earnings}</TableCell>
                            <TableCell className="text-right">${row.eps}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="flex justify-between border-t p-4">
            <Button variant="outline" onClick={onClose}>
              {t("close")}
            </Button>
            <Button>{t("tradeStock")}</Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

