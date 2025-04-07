"use client"

import { Suspense, useState, useEffect } from "react"
import { ArrowUpRight, CreditCard, DollarSign, Users, Download } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserNav } from "@/components/user-nav"
import { MainNav } from "@/components/main-nav"
import { Overview } from "@/components/overview"
import { RecentTransactions } from "@/components/recent-transactions"
import { PortfolioValue } from "@/components/portfolio-value"
import { AssetAllocation } from "@/components/asset-allocation"
import { TransactionForm } from "@/components/transaction-form"
import { SkeletonCard } from "@/components/skeleton-card"
import { useSettings } from "@/context/settings-context"
import { useTranslation } from "@/context/translation-context"
import { useUser } from "@/context/user-context"
import { generatePdfReport } from "@/lib/pdf-generator"
import { toast } from "@/components/ui/use-toast"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const { hideBalance } = useSettings()
  const { t } = useTranslation()
  const { user, loading, refreshUser } = useUser()
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const loadUser = async () => {
      try {
        await refreshUser()
      } catch (error) {
        console.error("Error refreshing user data:", error)
        // Show toast notification for error
        toast({
          title: "Error loading user data",
          description: "There was a problem loading your account information. Please try again later.",
          variant: "destructive",
        })
      }
    }

    loadUser()
  }, [])

  const handleViewAllTransactions = () => {
    setActiveTab("transactions")
  }

  const handleDownloadReport = async () => {
    setIsGeneratingPdf(true)
    try {
      await generatePdfReport()
    } finally {
      setIsGeneratingPdf(false)
    }
  }

  const handleTransactionComplete = async () => {
    setRefreshKey((prev) => prev + 1)
    await refreshUser() // call GET /api/user once after a transaction
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-tight">{t("portfolioDashboard")}</h2>
          <Button onClick={handleDownloadReport} disabled={isGeneratingPdf} className="w-full sm:w-auto">
            {isGeneratingPdf ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {t("generatingReport")}
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                {t("downloadReport")}
              </>
            )}
          </Button>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="w-full sm:w-auto flex flex-wrap">
            <TabsTrigger value="overview" className="flex-1 sm:flex-none">
              {t("overview")}
            </TabsTrigger>
            {/* <TabsTrigger value="transactions" className="flex-1 sm:flex-none">
              {t("transactions")}
            </TabsTrigger> */}
            {/* Uncomment to display transactions at the dashboard submenu */}
            <TabsTrigger value="assets" className="flex-1 sm:flex-none">
              {t("assets")}
            </TabsTrigger>
          </TabsList>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("totalBalance")}</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {hideBalance ? "••••••" : `$${user?.budget.totalBalance.toFixed(2) || "0.00"}`}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {hideBalance ? "••••••" : `+20.1% ${t("fromLastMonth")}`}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("investments")}</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {hideBalance ? "••••••" : `$${user?.budget.investments.toFixed(2) || "0.00"}`}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {hideBalance ? "••••••" : `+4.3% ${t("fromLastMonth")}`}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("cash")}</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {hideBalance ? "••••••" : `$${user?.budget.cash.toFixed(2) || "0.00"}`}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {hideBalance ? "••••••" : `+1.2% ${t("fromLastMonth")}`}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  >
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("activePositions")}</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {hideBalance ? "••" : user?.budget.activePositions || "0"}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {hideBalance ? "••••••" : `+3 ${t("sinceLastMonth")}`}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="col-span-4">
                    <CardHeader>
                      <CardTitle>{t("portfolioValue")}</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <Suspense fallback={<SkeletonCard />}>
                        <PortfolioValue hideValues={hideBalance} />
                      </Suspense>
                    </CardContent>
                  </Card>
                  <Card className="col-span-3">
                    <CardHeader>
                      <CardTitle>{t("assetAllocation")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Suspense fallback={<SkeletonCard />}>
                        <AssetAllocation hideValues={hideBalance} />
                      </Suspense>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="col-span-4">
                    <CardHeader>
                      <CardTitle>{t("overview")}</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <Overview hideValues={hideBalance} />
                    </CardContent>
                  </Card>
                  <Card className="col-span-3">
                    <CardHeader>
                      <CardTitle>{t("recentTransactions")}</CardTitle>
                      <CardDescription>{t("transactionsThisMonth").replace("{count}", "10")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RecentTransactions hideValues={hideBalance} key={refreshKey} refreshTrigger={refreshKey} />
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="link"
                        className="text-sm text-primary flex items-center p-0"
                        onClick={handleViewAllTransactions}
                      >
                        {t("viewAllTransactions")}
                        <ArrowUpRight className="ml-1 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="transactions" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("newTransaction")}</CardTitle>
                    <CardDescription>{t("buyOrSell")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TransactionForm onTransactionComplete={handleTransactionComplete} />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>{t("transactionHistory")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RecentTransactions showAll hideValues={hideBalance} key={refreshKey} refreshTrigger={refreshKey} />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="assets" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("assetBreakdown")}</CardTitle>
                    <CardDescription>{t("currentAllocation")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Suspense fallback={<SkeletonCard />}>
                      <AssetAllocation detailed hideValues={hideBalance} />
                    </Suspense>
                  </CardContent>
                </Card>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  )
}

