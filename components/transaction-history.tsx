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
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react"

import type { Transaction, TransactionFilters, TransactionType } from "@/types/transaction"
import { useTranslation } from "@/context/translation-context"
import { useSettings } from "@/context/settings-context"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TransactionDetails } from "@/components/transaction-details"
import { toast } from "@/components/ui/use-toast"

// Mock transactions for fallback
const MOCK_TRANSACTIONS = [
  {
    id: "t1",
    type: "buy",
    asset: "AAPL",
    amount: 5,
    price: 178.72,
    value: 893.6,
    date: "2023-12-01T10:30:00Z",
    status: "completed",
    userId: "user1",
  },
  {
    id: "t2",
    type: "sell",
    asset: "TSLA",
    amount: 2,
    price: 235.45,
    value: 470.9,
    date: "2023-11-28T14:15:00Z",
    status: "completed",
    userId: "user1",
  },
  {
    id: "t3",
    type: "buy",
    asset: "MSFT",
    amount: 3,
    price: 378.33,
    value: 1134.99,
    date: "2023-11-25T09:45:00Z",
    status: "completed",
    userId: "user1",
  },
  {
    id: "t4",
    type: "transfer",
    asset: "USD",
    amount: 1000,
    price: 1,
    value: 1000,
    date: "2023-11-20T16:20:00Z",
    status: "completed",
    userId: "user1",
    transferDirection: "send",
  },
  {
    id: "t5",
    type: "transfer",
    asset: "USD",
    amount: 500,
    price: 1,
    value: 500,
    date: "2023-11-15T11:10:00Z",
    status: "completed",
    userId: "user1",
    transferDirection: "receive",
  },
]

interface TransactionHistoryProps {
  limit?: number
  showFilters?: boolean
  refreshTrigger?: number
}

export function TransactionHistory({ limit, showFilters = true, refreshTrigger = 0 }: TransactionHistoryProps) {
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
        // Mock transactions data - always use this instead of API calls
        const MOCK_TRANSACTIONS = [
          {
            id: "t1",
            type: "buy",
            asset: "AAPL",
            amount: 5,
            price: 178.72,
            value: 893.6,
            date: "2023-12-01T10:30:00Z",
            status: "completed",
            userId: "user1",
          },
          {
            id: "t2",
            type: "sell",
            asset: "TSLA",
            amount: 2,
            price: 235.45,
            value: 470.9,
            date: "2023-11-28T14:15:00Z",
            status: "completed",
            userId: "user1",
          },
          {
            id: "t3",
            type: "buy",
            asset: "MSFT",
            amount: 3,
            price: 378.33,
            value: 1134.99,
            date: "2023-11-25T09:45:00Z",
            status: "completed",
            userId: "user1",
          },
          {
            id: "t4",
            type: "transfer",
            asset: "USD",
            amount: 1000,
            price: 1,
            value: 1000,
            date: "2023-11-20T16:20:00Z",
            status: "completed",
            userId: "user1",
            transferDirection: "send",
          },
          {
            id: "t5",
            type: "transfer",
            asset: "USD",
            amount: 500,
            price: 1,
            value: 500,
            date: "2023-11-15T11:10:00Z",
            status: "completed",
            userId: "user1",
            transferDirection: "receive",
          },
        ]

        // Apply filters if provided
        let filteredTransactions = [...MOCK_TRANSACTIONS]

        if (filters) {
          if (filters.type) {
            filteredTransactions = filteredTransactions.filter((t) => t.type === filters.type)
          }

          if (filters.asset) {
            filteredTransactions = filteredTransactions.filter((t) => t.asset === filters.asset)
          }

          if (filters.dateFrom) {
            filteredTransactions = filteredTransactions.filter((t) => new Date(t.date) >= new Date(filters.dateFrom))
          }

          if (filters.dateTo) {
            filteredTransactions = filteredTransactions.filter((t) => new Date(t.date) <= new Date(filters.dateTo))
          }

          if (filters.status) {
            filteredTransactions = filteredTransactions.filter((t) => t.status === filters.status)
          }
        }

        console.log("Using mock transaction data in TransactionHistory")
        setTransactions(filteredTransactions)
        setError(null)
      } catch (err) {
        console.error("Error in fetchTransactions:", err)
        setError("An unexpected error occurred. Using fallback data.")
        // Use fallback data as a last resort
        setTransactions([
          {
            id: "fallback1",
            type: "transfer",
            asset: "USD",
            amount: 1000,
            price: 1,
            value: 1000,
            date: new Date().toISOString(),
            status: "completed",
            userId: "user1",
            transferDirection: "send",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [filters, refreshTrigger])

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
  const getTypeIcon = (type: TransactionType, transferDirection?: string) => {
    switch (type) {
      case "buy":
        return <ArrowDownIcon className="h-4 w-4 text-emerald-500" />
      case "sell":
        return <ArrowUpIcon className="h-4 w-4 text-rose-500" />
      case "transfer":
        if (transferDirection === "send") {
          return <ArrowUpRight className="h-4 w-4 text-rose-500" />
        } else if (transferDirection === "receive") {
          return <ArrowDownLeft className="h-4 w-4 text-emerald-500" />
        } else {
          return <ArrowRightLeft className="h-4 w-4 text-blue-500" />
        }
      default:
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
        // Instead of calling API, just update local state
        setTransactions((prev) => prev.filter((t) => t.id !== id))
        toast({
          title: t("transactionDeleted"),
          description: t("transactionDeletedDesc"),
        })
      } catch (err) {
        console.error("Error deleting transaction:", err)
        toast({
          title: t("deleteFailed"),
          description: t("deleteFailedDesc"),
          variant: "destructive",
        })
      }
    }
  }

  // Handle transaction details view
  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
  }

  // Get transaction type display text
  const getTransactionTypeText = (transaction: Transaction) => {
    if (transaction.type === "transfer") {
      return transaction.transferDirection === "send" ? t("moneySent") : t("moneyReceived")
    }
    return t(transaction.type)
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
                        {getTypeIcon(transaction.type, transaction.transferDirection)}
                        <span className="capitalize">{getTransactionTypeText(transaction)}</span>
                      </div>
                    </TableCell>
                    <TableCell>{transaction.asset}</TableCell>
                    <TableCell className="text-right">{hideBalance ? "•••••" : transaction.amount}</TableCell>
                    <TableCell className="text-right">
                      {transaction.type === "transfer"
                        ? "-"
                        : hideBalance
                          ? "•••••"
                          : `$${transaction.price.toFixed(2)}`}
                    </TableCell>
                    <TableCell
                      className={`text-right ${
                        transaction.type === "transfer"
                          ? transaction.transferDirection === "send"
                            ? "text-rose-500"
                            : "text-emerald-500"
                          : transaction.type === "buy"
                            ? "text-rose-500"
                            : "text-emerald-500"
                      }`}
                    >
                      {hideBalance
                        ? "•••••"
                        : `${
                            (transaction.type === "transfer" && transaction.transferDirection === "receive") ||
                            transaction.type === "sell"
                              ? "+"
                              : "-"
                          }$${transaction.value.toFixed(2)}`}
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

