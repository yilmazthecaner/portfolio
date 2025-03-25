"use client"

import { useState } from "react"
import { motion } from "framer-motion"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserNav } from "@/components/user-nav"
import { MainNav } from "@/components/main-nav"
import { TransactionForm } from "@/components/transaction-form"
import { TransactionHistory } from "@/components/transaction-history"
import { useTranslation } from "@/context/translation-context"
import { useUser } from "@/context/user-context"

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState("history")
  const [refreshKey, setRefreshKey] = useState(0)
  const { t } = useTranslation()
  const { user } = useUser()

  const handleTransactionComplete = () => {
    // Switch to history tab after completing a transaction
    setActiveTab("history")
    // Trigger a refresh of the transaction history
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
          <h2 className="text-3xl font-bold tracking-tight">{t("transactions")}</h2>
          <div className="flex items-center space-x-2">
            <div className="text-sm text-muted-foreground">
              {t("availableCash")}: <span className="font-medium">${user?.budget.cash.toFixed(2) || "0.00"}</span>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="history">{t("transactionHistory")}</TabsTrigger>
            <TabsTrigger value="new">{t("newTransaction")}</TabsTrigger>
          </TabsList>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <TabsContent value="history" className="space-y-4">
              <TransactionHistory showFilters={true} refreshTrigger={refreshKey} />
            </TabsContent>

            <TabsContent value="new" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t("newTransaction")}</CardTitle>
                  <CardDescription>{t("buyOrSell")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <TransactionForm onTransactionComplete={handleTransactionComplete} />
                </CardContent>
              </Card>
            </TabsContent>
          </motion.div>
        </Tabs>
      </div>
    </div>
  )
}

