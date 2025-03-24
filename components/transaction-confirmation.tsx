"use client"

import { motion } from "framer-motion"
import {
  CheckCircle2,
  X,
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowRightLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Hash,
  CreditCard,
} from "lucide-react"
import type { Transaction } from "@/types/transaction"
import { useTranslation } from "@/context/translation-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSettings } from "@/context/settings-context"
import { useUser } from "@/context/user-context"
import { Separator } from "@/components/ui/separator"

interface TransactionConfirmationProps {
  transaction: Transaction
  onDismiss: () => void
}

export function TransactionConfirmation({ transaction, onDismiss }: TransactionConfirmationProps) {
  const { t, language } = useTranslation()
  const { hideBalance } = useSettings()
  const { user } = useUser()

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "buy":
        return <ArrowDownIcon className="h-5 w-5 text-emerald-500" />
      case "sell":
        return <ArrowUpIcon className="h-5 w-5 text-rose-500" />
      case "transfer":
        return <ArrowRightLeft className="h-5 w-5 text-blue-500" />
      default:
        return null
    }
  }

  const getAssetIcon = (asset: string) => {
    // Map common stock tickers to appropriate icons
    switch (asset) {
      case "AAPL":
        return "🍎"
      case "MSFT":
        return "💻"
      case "GOOGL":
        return "🔍"
      case "AMZN":
        return "📦"
      case "TSLA":
        return "🚗"
      case "NVDA":
        return "🎮"
      case "META":
        return "👓"
      case "USD":
        return "💵"
      default:
        return "📈"
    }
  }

  // Calculate budget impact
  const getBudgetImpact = () => {
    if (transaction.type === "buy") {
      return {
        cash: -transaction.value,
        investments: transaction.value,
        icon: <TrendingDown className="h-5 w-5 text-rose-500" />,
        cashClass: "text-rose-500",
        investClass: "text-emerald-500",
      }
    } else if (transaction.type === "sell") {
      return {
        cash: transaction.value,
        investments: -transaction.value,
        icon: <TrendingUp className="h-5 w-5 text-emerald-500" />,
        cashClass: "text-emerald-500",
        investClass: "text-rose-500",
      }
    } else {
      return {
        cash: transaction.value,
        investments: 0,
        icon: <DollarSign className="h-5 w-5 text-blue-500" />,
        cashClass: "text-emerald-500",
        investClass: "",
      }
    }
  }

  const budgetImpact = getBudgetImpact()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mt-6"
    >
      <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
        <CardHeader className="pb-2 flex flex-row items-start justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            <CardTitle className="text-green-800 dark:text-green-400">{t("transactionSuccessful")}</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={onDismiss} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline" className={getStatusColor(transaction.status)}>
              {t(transaction.status as "completed" | "pending" | "failed")}
            </Badge>
            <p className="text-sm text-muted-foreground">{formatDate(transaction.date)}</p>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-xl">
              {getAssetIcon(transaction.asset)}
            </div>
            <div>
              <h3 className="font-medium text-lg flex items-center gap-2">
                {getTypeIcon(transaction.type)}
                <span className="capitalize">
                  {t(transaction.type as "buy" | "sell" | "transfer")} {transaction.asset}
                </span>
              </h3>
              <p className="text-sm text-muted-foreground">
                {hideBalance ? "•••••" : `${transaction.amount} ${t("sharesAt")} $${transaction.price.toFixed(2)}`}
              </p>
            </div>
          </div>

          <div className="rounded-lg border p-4 bg-background mb-4">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              {budgetImpact.icon}
              {t("budgetImpact")}
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">{t("cash")}</span>
                <span className={`font-medium ${budgetImpact.cashClass}`}>
                  {hideBalance ? "•••••" : `${budgetImpact.cash > 0 ? "+" : ""}$${budgetImpact.cash.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">{t("investments")}</span>
                <span className={`font-medium ${budgetImpact.investClass}`}>
                  {hideBalance
                    ? "•••••"
                    : `${budgetImpact.investments > 0 ? "+" : ""}$${budgetImpact.investments.toFixed(2)}`}
                </span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{t("newBalance")}</span>
                <span className="font-bold">
                  {hideBalance ? "•••••" : `$${user?.budget.totalBalance.toFixed(2) || "0.00"}`}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{t("transactionId")}</p>
              </div>
              <p className="font-medium">{transaction.id}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{t("date")}</p>
              </div>
              <p className="font-medium">{formatDate(transaction.date)}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{t("asset")}</p>
              </div>
              <p className="font-medium">{transaction.asset}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{t("totalValue")}</p>
              </div>
              <p className="font-medium">{hideBalance ? "•••••" : `$${transaction.value.toFixed(2)}`}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-2 flex flex-col sm:flex-row gap-2 sm:gap-4">
          <Button variant="outline" className="w-full sm:w-auto" onClick={onDismiss}>
            {t("close")}
          </Button>
          <Button className="w-full sm:w-auto" onClick={() => (window.location.href = "/transactions")}>
            {t("viewAllTransactions")}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

