"use client"

import { useState } from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslation } from "@/context/translation-context"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Globe, DollarSign, Bitcoin, BarChart3 } from "lucide-react"

// Mock data for market indices
const indicesData = [
  { name: "Jan", SP500: 4500, NASDAQ: 14000, DOW: 35000 },
  { name: "Feb", SP500: 4550, NASDAQ: 14200, DOW: 35200 },
  { name: "Mar", SP500: 4600, NASDAQ: 14100, DOW: 35400 },
  { name: "Apr", SP500: 4650, NASDAQ: 14300, DOW: 35600 },
  { name: "May", SP500: 4700, NASDAQ: 14500, DOW: 35800 },
  { name: "Jun", SP500: 4750, NASDAQ: 14700, DOW: 36000 },
  { name: "Jul", SP500: 4800, NASDAQ: 14600, DOW: 36200 },
  { name: "Aug", SP500: 4850, NASDAQ: 14800, DOW: 36400 },
  { name: "Sep", SP500: 4900, NASDAQ: 15000, DOW: 36600 },
  { name: "Oct", SP500: 4950, NASDAQ: 15200, DOW: 36800 },
  { name: "Nov", SP500: 5000, NASDAQ: 15400, DOW: 37000 },
  { name: "Dec", SP500: 5050, NASDAQ: 15600, DOW: 37200 },
]

// Mock data for sector performance
const sectorData = [
  { name: "Technology", value: 12.5 },
  { name: "Healthcare", value: 8.2 },
  { name: "Financials", value: 5.7 },
  { name: "Consumer", value: 3.2 },
  { name: "Energy", value: -2.1 },
  { name: "Utilities", value: 1.8 },
  { name: "Materials", value: 4.3 },
  { name: "Industrials", value: 6.9 },
  { name: "Real Estate", value: -1.5 },
  { name: "Communication", value: 7.8 },
]

// Mock data for market cap distribution
const marketCapData = [
  { name: "Large Cap", value: 65 },
  { name: "Mid Cap", value: 25 },
  { name: "Small Cap", value: 10 },
]

const COLORS = [
  "hsl(var(--chart-primary))",
  "hsl(var(--chart-secondary))",
  "hsl(var(--chart-tertiary))",
  "hsl(var(--chart-quaternary))",
  "hsl(var(--chart-quinary))",
  "hsl(var(--chart-senary))",
]

export function MarketOverview() {
  const [period, setPeriod] = useState("1Y")
  const [chartType, setChartType] = useState("indices")
  const { t } = useTranslation()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>{t("marketIndices")}</CardTitle>
            <CardDescription>{t("keyMarketIndicesPerformance")}</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder={t("period")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1D">1D</SelectItem>
                <SelectItem value="1W">1W</SelectItem>
                <SelectItem value="1M">1M</SelectItem>
                <SelectItem value="3M">3M</SelectItem>
                <SelectItem value="1Y">1Y</SelectItem>
                <SelectItem value="5Y">5Y</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={indicesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--background)",
                    borderColor: "var(--border)",
                    borderRadius: "0.5rem",
                  }}
                  itemStyle={{ color: "var(--foreground)" }}
                  labelStyle={{ color: "var(--foreground)" }}
                />
                <Legend />
                <Line type="monotone" dataKey="SP500" stroke="#4f46e5" activeDot={{ r: 8 }} name="S&P 500" />
                <Line type="monotone" dataKey="NASDAQ" stroke="#10b981" name="NASDAQ" />
                <Line type="monotone" dataKey="DOW" stroke="#f59e0b" name="DOW" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("topGainers")}</CardTitle>
          <CardDescription>{t("bestPerformingStocks")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { symbol: "NVDA", name: "NVIDIA Corporation", change: 12.34, changePercent: 2.6 },
              { symbol: "ASML", name: "ASML Holding", change: 10.21, changePercent: 1.61 },
              { symbol: "NFLX", name: "Netflix, Inc.", change: 8.76, changePercent: 1.57 },
              { symbol: "META", name: "Meta Platforms, Inc.", change: 5.23, changePercent: 1.62 },
              { symbol: "MSFT", name: "Microsoft Corporation", change: 4.51, changePercent: 1.21 },
            ].map((stock) => (
              <div key={stock.symbol} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{stock.symbol}</div>
                  <div className="text-sm text-muted-foreground">{stock.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-green-600 font-medium">+{stock.changePercent.toFixed(2)}%</div>
                  <div className="text-sm text-green-600">+${stock.change.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("topLosers")}</CardTitle>
          <CardDescription>{t("worstPerformingStocks")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { symbol: "TSLA", name: "Tesla, Inc.", change: -5.67, changePercent: -2.35 },
              { symbol: "BABA", name: "Alibaba Group Holding", change: -1.45, changePercent: -1.63 },
              { symbol: "9988.HK", name: "Alibaba Group Holding", change: -1.45, changePercent: -1.63 },
              { symbol: "GOOGL", name: "Alphabet Inc.", change: -1.23, changePercent: -0.91 },
              { symbol: "INTC", name: "Intel Corporation", change: -0.87, changePercent: -0.76 },
            ].map((stock) => (
              <div key={stock.symbol} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{stock.symbol}</div>
                  <div className="text-sm text-muted-foreground">{stock.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-red-600 font-medium">{stock.changePercent.toFixed(2)}%</div>
                  <div className="text-sm text-red-600">${stock.change.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("marketSummary")}</CardTitle>
          <CardDescription>{t("keyMarketIndicators")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <BarChart3 className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{t("volatilityIndex")}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">VIX</span>
                  <Badge
                    variant="outline"
                    className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                  >
                    18.45 <TrendingUp className="ml-1 h-3 w-3" />
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{t("usDollarIndex")}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">DXY</span>
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  >
                    104.2 <TrendingUp className="ml-1 h-3 w-3" />
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{t("globalMarkets")}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">FTSE</span>
                  <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                    7,452.35 <TrendingDown className="ml-1 h-3 w-3" />
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <Bitcoin className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{t("crypto")}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">BTC</span>
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  >
                    $65,432 <TrendingUp className="ml-1 h-3 w-3" />
                  </Badge>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Tabs defaultValue="sectors">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="sectors">{t("sectors")}</TabsTrigger>
                  <TabsTrigger value="marketCap">{t("marketCap")}</TabsTrigger>
                </TabsList>
                <TabsContent value="sectors" className="pt-4">
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={sectorData.sort((a, b) => b.value - a.value)}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.2} />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" width={80} />
                        <Tooltip
                          formatter={(value: number) => [`${value}%`, t("performance")]}
                          contentStyle={{
                            backgroundColor: "var(--background)",
                            borderColor: "var(--border)",
                            borderRadius: "0.5rem",
                          }}
                          itemStyle={{ color: "var(--foreground)" }}
                          labelStyle={{ color: "var(--foreground)" }}
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                          {sectorData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.value >= 0 ? "hsl(var(--chart-primary))" : "hsl(var(--destructive))"}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                <TabsContent value="marketCap" className="pt-4">
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={marketCapData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {marketCapData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => [`${value}%`, t("distribution")]}
                          contentStyle={{
                            backgroundColor: "var(--background)",
                            borderColor: "var(--border)",
                            borderRadius: "0.5rem",
                          }}
                          itemStyle={{ color: "var(--foreground)" }}
                          labelStyle={{ color: "var(--foreground)" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

