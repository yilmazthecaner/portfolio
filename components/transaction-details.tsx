"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { X, ArrowDownIcon, ArrowUpIcon, ArrowRightLeft, Hash, CreditCard, DollarSign } from "lucide-react"

import type { Transaction } from "@/types/transaction"
import { useTranslation } from "@/context/translation-context"
import { useSettings } from "@/context/settings-context"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface TransactionDetailsProps {
  transaction: Transaction
  onClose: () => void
}

export function TransactionDetails({ transaction, onClose }: TransactionDetailsProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const { t, language } = useTranslation()
  const { hideBalance } = useSettings()

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
    return date.toLocaleString(language === "tr" ? "tr-TR" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "buy":
        return <ArrowDownIcon className="h-6 w-6 text-emerald-500" />
      case "sell":
        return <ArrowUpIcon className="h-6 w-6 text-rose-500" />
      case "transfer":
        return <ArrowRightLeft className="h-6 w-6 text-blue-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
    }
  }

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
          <CardHeader className="relative pb-2">
            <Button variant="ghost" size="icon" className="absolute right-2 top-2" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3">
              {getTypeIcon(transaction.type)}
              <CardTitle>{t("transactionDetails")}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex justify-between items-center mb-4">
              <Badge variant="outline" className={getStatusColor(transaction.status)}>
                {t(transaction.status as "completed" | "pending" | "failed")}
              </Badge>
              <p className="text-sm text-muted-foreground">{formatDate(transaction.date)}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Hash className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">{t("transactionId")}</p>
                  <p className="font-medium">{transaction.id}</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">{t("asset")}</p>
                  <p className="font-medium">{transaction.asset}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t("amount")}</p>
                  <p className="font-medium">{hideBalance ? "•••••" : transaction.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("price")}</p>
                  <p className="font-medium">{hideBalance ? "•••••" : `$${transaction.price.toFixed(2)}`}</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{t("totalValue")}</p>
                </div>
                <p className="font-bold text-lg">{hideBalance ? "•••••" : `$${transaction.value.toFixed(2)}`}</p>
              </div>

              {transaction.fee && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{t("fee")}</p>
                  <p className="font-medium">{hideBalance ? "•••••" : `$${transaction.fee.toFixed(2)}`}</p>
                </div>
              )}

              {transaction.notes && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{t("notes")}</p>
                    <p className="text-sm">{transaction.notes}</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              {t("close")}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

