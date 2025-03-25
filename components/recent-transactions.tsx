"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowDownIcon, ArrowUpIcon, ArrowRightLeft, ArrowUpRight, ArrowDownLeft } from "lucide-react"
import { useTranslation } from "@/context/translation-context"
import { Skeleton } from "@/components/ui/skeleton"
import { TransactionDetails } from "@/components/transaction-details"

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

interface Transaction {
  id: string
  type: "buy" | "sell" | "transfer"
  asset: string
  amount: number
  price: number
  date: string
  status: "completed" | "pending" | "failed"
  transferDirection?: "send" | "receive"
  value: number
}

export function RecentTransactions({
  showAll = false,
  hideValues = false,
  refreshTrigger = 0,
}: {
  showAll?: boolean
  hideValues?: boolean
  refreshTrigger?: number
}) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const { t, language } = useTranslation()

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

        console.log("Using mock transaction data in RecentTransactions")
        setTransactions(MOCK_TRANSACTIONS)
      } catch (error) {
        console.error("Error in fetchTransactions:", error)
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
  }, [refreshTrigger])

  const displayedTransactions = showAll ? transactions : transactions.slice(0, 5)

  const getTransactionIcon = (transaction: Transaction) => {
    if (transaction.type === "buy") {
      return <ArrowDownIcon className="h-4 w-4 text-emerald-500" />
    } else if (transaction.type === "sell") {
      return <ArrowUpIcon className="h-4 w-4 text-rose-500" />
    } else if (transaction.type === "transfer") {
      if (transaction.transferDirection === "send") {
        return <ArrowUpRight className="h-4 w-4 text-rose-500" />
      } else if (transaction.transferDirection === "receive") {
        return <ArrowDownLeft className="h-4 w-4 text-emerald-500" />
      } else {
        return <ArrowRightLeft className="h-4 w-4 text-blue-500" />
      }
    }
    return <ArrowRightLeft className="h-4 w-4 text-blue-500" />
  }

  const getTransactionDescription = (transaction: Transaction) => {
    if (transaction.type === "buy") {
      return `${t("bought")} ${transaction.asset}`
    } else if (transaction.type === "sell") {
      return `${t("sold")} ${transaction.asset}`
    } else if (transaction.type === "transfer") {
      if (transaction.transferDirection === "send") {
        return `${t("moneySent")} ${transaction.asset}`
      } else if (transaction.transferDirection === "receive") {
        return `${t("moneyReceived")} ${transaction.asset}`
      } else {
        return `${t("transferred")} ${transaction.asset}`
      }
    }
    return `${t("transferred")} ${transaction.asset}`
  }

  const getTransactionValueClass = (transaction: Transaction) => {
    if (transaction.type === "buy" || (transaction.type === "transfer" && transaction.transferDirection === "send")) {
      return "text-rose-500"
    } else if (
      transaction.type === "sell" ||
      (transaction.type === "transfer" && transaction.transferDirection === "receive")
    ) {
      return "text-emerald-500"
    }
    return ""
  }

  const getTransactionValuePrefix = (transaction: Transaction) => {
    if (transaction.type === "buy" || (transaction.type === "transfer" && transaction.transferDirection === "send")) {
      return "-"
    } else if (
      transaction.type === "sell" ||
      (transaction.type === "transfer" && transaction.transferDirection === "receive")
    ) {
      return "+"
    }
    return ""
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-center">
            <Skeleton className="h-9 w-9 rounded-full mr-3" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-3 w-[150px]" />
            </div>
            <div className="text-right">
              <Skeleton className="h-4 w-[80px] ml-auto" />
              <Skeleton className="h-3 w-[60px] ml-auto mt-1" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {displayedTransactions.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">{t("noTransactionsFound")}</p>
      ) : (
        displayedTransactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            className="flex items-center cursor-pointer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedTransaction(transaction)}
          >
            <Avatar className="h-9 w-9 mr-3">
              <AvatarImage src={`/placeholder.svg?height=36&width=36`} alt={transaction.asset} />
              <AvatarFallback className="bg-primary/10">{getTransactionIcon(transaction)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">{getTransactionDescription(transaction)}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(transaction.date).toLocaleDateString(language === "tr" ? "tr-TR" : "en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="text-right">
              <p className={`text-sm font-medium leading-none ${getTransactionValueClass(transaction)}`}>
                {getTransactionValuePrefix(transaction)}
                {hideValues ? "•••••" : `$${transaction.value.toFixed(2)}`}
              </p>
              <p className="text-xs text-muted-foreground">
                {hideValues ? "•••" : transaction.amount}{" "}
                {transaction.type !== "transfer" ? (hideValues ? "@ •••" : `@ $${transaction.price}`) : ""}
              </p>
            </div>
          </motion.div>
        ))
      )}

      {selectedTransaction && (
        <TransactionDetails transaction={selectedTransaction} onClose={() => setSelectedTransaction(null)} />
      )}
    </div>
  )
}

