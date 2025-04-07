"use client"

import { useState, useEffect } from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { filterSymbols } from "./stock-symbols-data"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "@/context/translation-context"

interface AssetSymbolSelectorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function AssetSymbolSelector({ value, onChange, placeholder }: AssetSymbolSelectorProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredSymbols, setFilteredSymbols] = useState(filterSymbols(""))

  // Update filtered symbols when search term changes
  useEffect(() => {
    setFilteredSymbols(filterSymbols(searchTerm))
  }, [searchTerm])

  // Get sector color
  const getSectorColor = (sector: string) => {
    switch (sector) {
      case "Technology":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case "Financial Services":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "Healthcare":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
      case "Consumer Cyclical":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "Consumer Defensive":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
      case "ETF":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400"
      case "Bond":
        return "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400"
      case "Commodity":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
      case "Cryptocurrency":
        return "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  // Group symbols by sector
  const groupedSymbols: Record<string, typeof filteredSymbols> = {}
  filteredSymbols.forEach((symbol) => {
    if (!groupedSymbols[symbol.sector]) {
      groupedSymbols[symbol.sector] = []
    }
    groupedSymbols[symbol.sector].push(symbol)
  })

  // Sort sectors alphabetically
  const sortedSectors = Object.keys(groupedSymbols).sort()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {value ? (
            <>
              {value}
              {filteredSymbols.find((s) => s.symbol === value)?.name && (
                <span className="ml-2 text-muted-foreground text-xs truncate">
                  {filteredSymbols.find((s) => s.symbol === value)?.name}
                </span>
              )}
            </>
          ) : (
            <span className="text-muted-foreground">{placeholder || t("selectAsset")}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[300px]" align="start">
        <Command>
          <CommandInput placeholder={t("searchSymbol")} value={searchTerm} onValueChange={setSearchTerm} />
          <CommandList>
            <CommandEmpty>{t("noSymbolsFound")}</CommandEmpty>
            {sortedSectors.map((sector) => (
              <CommandGroup key={sector} heading={sector}>
                {groupedSymbols[sector].map((symbol) => (
                  <CommandItem
                    key={symbol.symbol}
                    value={symbol.symbol}
                    onSelect={(currentValue) => {
                      onChange(currentValue)
                      setOpen(false)
                    }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <span className="font-medium">{symbol.symbol}</span>
                        <Badge variant="outline" className={cn("ml-2 text-xs", getSectorColor(symbol.sector))}>
                          {symbol.sector}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">{symbol.name}</span>
                    </div>
                    <Check className={cn("h-4 w-4", value === symbol.symbol ? "opacity-100" : "opacity-0")} />
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

