"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowDownIcon, ArrowUpIcon, ArrowRightLeft } from "lucide-react"
import { useTranslation } from "@/context/translation-context"

interface Transaction {
  id: string
  type: "buy" | "sell" | "transfer"
  asset: string
  amount: number
  price: number
  date: string
  status: "completed" | "pending" | "failed"
}

const recentTransactions: Transaction[] = [
  {
    id: "t1",
    type: "buy",
    asset: "AAPL",
    amount: 5,
    price: 178.72,
    date: "2023-12-01",
    status: "completed",
  },
  {
    id: "t2",
    type: "sell",
    asset: "TSLA",
    amount: 2,
    price: 235.45,
    date: "2023-11-28",
    status: "completed",
  },
  {
    id: "t3",
    type: "buy",
    asset: "MSFT",
    amount: 3,
    price: 378.33,
    date: "2023-11-25",
    status: "completed",
  },
  {
    id: "t4",
    type: "transfer",
    asset: "USD",
    amount: 1000,
    price: 1,
    date: "2023-11-20",
    status: "completed",
  },
  {
    id: "t5",
    type: "buy",
    asset: "NVDA",
    amount: 2,
    price: 487.21,
    date: "2023-11-15",
    status: "completed",
  },
  {
    id: "t6",
    type: "sell",
    asset: "AMZN",
    amount: 4,
    price: 146.88,
    date: "2023-11-10",
    status: "completed",
  },
  {
    id: "t7",
    type: "buy",
    asset: "GOOGL",
    amount: 3,
    price: 134.99,
    date: "2023-11-05",
    status: "completed",
  },
]

export function RecentTransactions({
  showAll = false,
  hideValues = false,
}: { showAll?: boolean; hideValues?: boolean }) {
  const transactions = showAll ? recentTransactions : recentTransactions.slice(0, 5)
  const { t, language } = useTranslation()

  return (
    <div className="space-y-4">
      {transactions.map((transaction, index) => (
        <motion.div
          key={transaction.id}
          className="flex items-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          whileHover={{ scale: 1.02 }}
        >
          <Avatar className="h-9 w-9 mr-3">
            <AvatarImage src={`/placeholder.svg?height=36&width=36`} alt={transaction.asset} />
            <AvatarFallback className="bg-primary/10">
              {transaction.type === "buy" ? (
                <ArrowDownIcon className="h-4 w-4 text-emerald-500" />
              ) : transaction.type === "sell" ? (
                <ArrowUpIcon className="h-4 w-4 text-rose-500" />
              ) : (
                <ArrowRightLeft className="h-4 w-4 text-blue-500" />
              )}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              {transaction.type === "buy"
                ? `${t("bought")} ${transaction.asset}`
                : transaction.type === "sell"
                  ? `${t("sold")} ${transaction.asset}`
                  : `${t("transferred")} ${transaction.asset}`}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(transaction.date).toLocaleDateString(language === "tr" ? "tr-TR" : "en-US")}
            </p>
          </div>
          <div className="text-right">
            <p
              className={`text-sm font-medium leading-none ${
                transaction.type === "buy" ? "text-emerald-500" : transaction.type === "sell" ? "text-rose-500" : ""
              }`}
            >
              {transaction.type === "buy" ? "-" : transaction.type === "sell" ? "+" : ""}
              {hideValues ? "•••••" : `$${(transaction.amount * transaction.price).toFixed(2)}`}
            </p>
            <p className="text-xs text-muted-foreground">
              {hideValues ? "•••" : transaction.amount}{" "}
              {transaction.type !== "transfer" ? (hideValues ? "@ •••" : `@ $${transaction.price}`) : ""}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

