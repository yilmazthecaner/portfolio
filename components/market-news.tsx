"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/context/translation-context"
import { Clock, ExternalLink, Globe, Tag } from "lucide-react"

// Mock news data
const newsData = [
  {
    id: 1,
    title: "Federal Reserve Holds Interest Rates Steady",
    summary:
      "The Federal Reserve announced today that it will maintain current interest rates, citing stable inflation and strong employment figures.",
    source: "Financial Times",
    date: "2024-03-25T14:30:00Z",
    category: "Economy",
    url: "#",
    image: "/placeholder.svg?height=100&width=100&text=FT",
  },
  {
    id: 2,
    title: "Apple Unveils New Product Line at Annual Event",
    summary:
      "Apple Inc. revealed its latest iPhone models and other products at its annual September event, with shares rising 2% following the announcement.",
    source: "TechCrunch",
    date: "2024-03-24T18:15:00Z",
    category: "Technology",
    url: "#",
    image: "/placeholder.svg?height=100&width=100&text=TC",
  },
  {
    id: 3,
    title: "Oil Prices Surge Amid Middle East Tensions",
    summary:
      "Crude oil prices jumped 3% today as geopolitical tensions in the Middle East raised concerns about potential supply disruptions.",
    source: "Reuters",
    date: "2024-03-24T09:45:00Z",
    category: "Commodities",
    url: "#",
    image: "/placeholder.svg?height=100&width=100&text=Reuters",
  },
  {
    id: 4,
    title: "Tesla Exceeds Quarterly Delivery Expectations",
    summary:
      "Tesla reported delivering more vehicles than analysts expected in the first quarter, sending the electric vehicle maker's stock up by 5%.",
    source: "Bloomberg",
    date: "2024-03-23T21:10:00Z",
    category: "Automotive",
    url: "#",
    image: "/placeholder.svg?height=100&width=100&text=Bloomberg",
  },
  {
    id: 5,
    title: "Amazon Acquires AI Startup for $1.2 Billion",
    summary:
      "Amazon announced the acquisition of an artificial intelligence startup specializing in retail analytics, in a deal valued at $1.2 billion.",
    source: "Wall Street Journal",
    date: "2024-03-23T16:30:00Z",
    category: "Technology",
    url: "#",
    image: "/placeholder.svg?height=100&width=100&text=WSJ",
  },
  {
    id: 6,
    title: "European Markets Close Higher on Strong Economic Data",
    summary:
      "European stock indices finished the day with gains after new economic data showed better-than-expected growth in several key economies.",
    source: "CNBC",
    date: "2024-03-22T17:00:00Z",
    category: "Global Markets",
    url: "#",
    image: "/placeholder.svg?height=100&width=100&text=CNBC",
  },
  {
    id: 7,
    title: "Bitcoin Surpasses $70,000 for First Time",
    summary:
      "The world's largest cryptocurrency reached a new all-time high, crossing the $70,000 mark amid increased institutional adoption.",
    source: "CoinDesk",
    date: "2024-03-22T12:20:00Z",
    category: "Cryptocurrency",
    url: "#",
    image: "/placeholder.svg?height=100&width=100&text=CoinDesk",
  },
  {
    id: 8,
    title: "Microsoft Announces Major Cloud Computing Expansion",
    summary:
      "Microsoft revealed plans to invest $15 billion in expanding its global cloud computing infrastructure over the next five years.",
    source: "TechCrunch",
    date: "2024-03-21T14:45:00Z",
    category: "Technology",
    url: "#",
    image: "/placeholder.svg?height=100&width=100&text=TC",
  },
]

export function MarketNews() {
  const [activeCategory, setActiveCategory] = useState("all")
  const { t, language } = useTranslation()

  const filteredNews = activeCategory === "all" ? newsData : newsData.filter((news) => news.category === activeCategory)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString(language === "tr" ? "tr-TR" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const categories = ["all", ...Array.from(new Set(newsData.map((news) => news.category)))]

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
          <div>
            <CardTitle>{t("marketNews")}</CardTitle>
            <CardDescription>{t("latestFinancialNews")}</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setActiveCategory(category)}
              >
                {category === "all" ? t("allCategories") : category}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {filteredNews.map((news) => (
            <Card key={news.id} className="overflow-hidden">
              <div className="flex">
                <div className="w-1/4 min-w-[100px]">
                  <img
                    src={news.image || "/placeholder.svg"}
                    alt={news.source}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 p-4">
                  <h3 className="font-semibold mb-2">{news.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{news.summary}</p>
                  <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Globe className="h-3 w-3" />
                      <span>{news.source}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(news.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="h-3 w-3" />
                      <span>{news.category}</span>
                    </div>
                  </div>
                </div>
              </div>
              <CardFooter className="p-2 bg-muted/50 flex justify-end">
                <Button variant="ghost" size="sm" className="text-xs">
                  {t("readMore")} <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

