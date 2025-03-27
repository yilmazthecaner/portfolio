"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { X, Search, Plus, Check } from "lucide-react"
import { useTranslation } from "@/context/translation-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { allStocksData } from "@/components/market-watchlist"
import { Badge } from "@/components/ui/badge"

interface AddToWatchlistProps {
  onClose: () => void
  onAddStock: (symbol: string) => void
  currentWatchlist: string[]
}

export function AddToWatchlist({ onClose, onAddStock, currentWatchlist }: AddToWatchlistProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const { t } = useTranslation()

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

  // Filter stocks based on search term
  const filteredStocks = allStocksData
    .filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    // Sort by already in watchlist (to bottom) then alphabetically
    .sort((a, b) => {
      const aInWatchlist = currentWatchlist.includes(a.symbol)
      const bInWatchlist = currentWatchlist.includes(b.symbol)

      if (aInWatchlist && !bInWatchlist) return 1
      if (!aInWatchlist && bInWatchlist) return -1

      return a.symbol.localeCompare(b.symbol)
    })

  return (
    <div ref={overlayRef} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="relative">
            <Button variant="ghost" size="icon" className="absolute right-2 top-2" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
            <CardTitle>{t("addToWatchlist")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("searchSymbolOrCompany")}
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>

            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {filteredStocks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">{t("noStocksFound")}</div>
              ) : (
                filteredStocks.map((stock) => {
                  const isInWatchlist = currentWatchlist.includes(stock.symbol)

                  return (
                    <div
                      key={stock.symbol}
                      className={`flex items-center justify-between p-2 rounded-md hover:bg-muted/50 ${isInWatchlist ? "opacity-50" : ""}`}
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{stock.symbol}</span>
                          <Badge variant="outline" className="text-xs">
                            {stock.sector}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">{stock.name}</span>
                      </div>

                      <Button
                        variant={isInWatchlist ? "ghost" : "outline"}
                        size="sm"
                        onClick={() => !isInWatchlist && onAddStock(stock.symbol)}
                        disabled={isInWatchlist}
                      >
                        {isInWatchlist ? (
                          <>
                            <Check className="mr-1 h-3 w-3" />
                            {t("added")}
                          </>
                        ) : (
                          <>
                            <Plus className="mr-1 h-3 w-3" />
                            {t("add")}
                          </>
                        )}
                      </Button>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              {t("done")}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

