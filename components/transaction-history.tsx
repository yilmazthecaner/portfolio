"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowRightLeft,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  FileText,
  Trash2,
} from "lucide-react"

import type { Transaction, TransactionFilters, TransactionType } from "@/types/transaction"
import { useTranslation } from "@/context/translation-context"
import { useSettings } from "@/context/settings-context"
import { transactionApi } from "@/lib/api"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TransactionDetails } from "@/components/transaction-details"

interface TransactionHistoryProps {
  limit?: number
  showFilters?: boolean
}

export function TransactionHistory({ limit, showFilters = true }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<TransactionFilters>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof Transaction>("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

  const { t, language } = useTranslation()
  const { hideBalance } = useSettings()

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true)
      try {
        // Convert 'all' values to undefined to avoid sending them as query params
        const cleanedFilters = { ...filters }
        Object.keys(cleanedFilters).forEach((key) => {
          if (cleanedFilters[key as keyof TransactionFilters] === "all") {
            delete cleanedFilters[key as keyof TransactionFilters]
          }
        })

        const data = await transactionApi.getTransactions(cleanedFilters)
        setTransactions(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching transactions:", err)
        setError(err instanceof Error ? err.message : "Failed to load transactions")
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [filters])

  // Handle filter changes
  const handleFilterChange = (key: keyof TransactionFilters, value: string | undefined) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "all" ? undefined : value,
    }))
  }

  // Handle sort changes
  const handleSort = (field: keyof Transaction) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  // Format date based on language
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

  // Apply sorting to transactions
  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortField === "date") {
      return sortDirection === "asc"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime()
    }

    if (typeof a[sortField] === "string" && typeof b[sortField] === "string") {
      return sortDirection === "asc"
        ? (a[sortField] as string).localeCompare(b[sortField] as string)
        : (b[sortField] as string).localeCompare(a[sortField] as string)
    }

    return sortDirection === "asc"
      ? (a[sortField] as number) - (b[sortField] as number)
      : (b[sortField] as number) - (a[sortField] as number)
  })

  // Apply search filter
  const filteredTransactions = sortedTransactions.filter((transaction) => {
    if (!searchTerm) return true

    const searchLower = searchTerm.toLowerCase()
    return (
      transaction.asset.toLowerCase().includes(searchLower) ||
      transaction.id.toLowerCase().includes(searchLower) ||
      transaction.type.toLowerCase().includes(searchLower) ||
      transaction.status.toLowerCase().includes(searchLower)
    )
  })

  // Apply limit if specified
  const displayedTransactions = limit ? filteredTransactions.slice(0, limit) : filteredTransactions

  // Get transaction type icon
  const getTypeIcon = (type: TransactionType) => {
    switch (type) {
      case "buy":
        return <ArrowDownIcon className="h-4 w-4 text-emerald-500" />
      case "sell":
        return <ArrowUpIcon className="h-4 w-4 text-rose-500" />
      case "transfer":
        return <ArrowRightLeft className="h-4 w-4 text-blue-500" />
    }
  }

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            {t("completed")}
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            {t("pending")}
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            {t("failed")}
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Handle transaction deletion
  const handleDeleteTransaction = async (id: string) => {
    if (window.confirm(t("confirmDeleteTransaction"))) {
      try {
        await transactionApi.deleteTransaction(id)
        setTransactions((prev) => prev.filter((t) => t.id !== id))
      } catch (err) {
        console.error("Error deleting transaction:", err)
      }
    }
  }

  // Handle transaction details view
  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
  }

  return (
    <div className="space-y-4">
      {showFilters && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{t("filterTransactions")}</CardTitle>
            <CardDescription>{t("filterTransactionsDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("search")}</label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t("searchPlaceholder")}
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t("type")}</label>
                <Select
                  value={filters.type || ""}
                  onValueChange={(value) => handleFilterChange("type", value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("allTypes")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allTypes")}</SelectItem>
                    <SelectItem value="buy">{t("buy")}</SelectItem>
                    <SelectItem value="sell">{t("sell")}</SelectItem>
                    <SelectItem value="transfer">{t("transfer")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t("status")}</label>
                <Select
                  value={filters.status || ""}
                  onValueChange={(value) => handleFilterChange("status", value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("allStatuses")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allStatuses")}</SelectItem>
                    <SelectItem value="completed">{t("completed")}</SelectItem>
                    <SelectItem value="pending">{t("pending")}</SelectItem>
                    <SelectItem value="failed">{t("failed")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t("dateRange")}</label>
                <div className="flex space-x-2">
                  <Input
                    type="date"
                    value={filters.dateFrom || ""}
                    onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                    className="w-1/2"
                  />
                  <Input
                    type="date"
                    value={filters.dateTo || ""}
                    onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                    className="w-1/2"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => setFilters({})}>
                <Filter className="h-4 w-4" />
                {t("resetFilters")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
      ) : error ? (
        <div className="rounded-lg border border-destructive p-4 bg-destructive/10">
          <p className="text-destructive">{error}</p>
        </div>
      ) : displayedTransactions.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">{t("noTransactionsFound")}</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
                  <div className="flex items-center">
                    {t("date")}
                    {sortField === "date" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("type")}>
                  <div className="flex items-center">
                    {t("type")}
                    {sortField === "type" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("asset")}>
                  <div className="flex items-center">
                    {t("asset")}
                    {sortField === "asset" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
                <TableHead className="text-right">{t("amount")}</TableHead>
                <TableHead className="text-right">{t("price")}</TableHead>
                <TableHead className="text-right">{t("value")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {displayedTransactions.map((transaction) => (
                  <motion.tr
                    key={transaction.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleViewDetails(transaction)}
                  >
                    <TableCell className="font-medium">{formatDate(transaction.date)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {getTypeIcon(transaction.type)}
                        <span className="capitalize">{t(transaction.type)}</span>
                      </div>
                    </TableCell>
                    <TableCell>{transaction.asset}</TableCell>
                    <TableCell className="text-right">{hideBalance ? "•••••" : transaction.amount}</TableCell>
                    <TableCell className="text-right">
                      {hideBalance ? "•••••" : `$${transaction.price.toFixed(2)}`}
                    </TableCell>
                    <TableCell className="text-right">
                      {hideBalance ? "•••••" : `$${transaction.value.toFixed(2)}`}
                    </TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">{t("actions")}</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              handleViewDetails(transaction)
                            }}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            {t("viewDetails")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteTransaction(transaction.id)
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t("delete")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
      )}

      {selectedTransaction && (
        <TransactionDetails transaction={selectedTransaction} onClose={() => setSelectedTransaction(null)} />
      )}
    </div>
  )
}

