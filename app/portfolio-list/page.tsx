"use client"

import { useState } from "react"
import { motion } from "framer-motion"

import { UserNav } from "@/components/user-nav"
import { MainNav } from "@/components/main-nav"
import { useTranslation } from "@/context/translation-context"
import { PortfolioGrid } from "@/components/portfolio-grid"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { PortfolioItemForm } from "@/components/portfolio-item-form"

export default function PortfolioListPage() {
  const { t } = useTranslation()
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)

  const handleAddNew = () => {
    setEditingItem(null)
    setShowAddForm(true)
  }

  const handleEdit = (item: any) => {
    setEditingItem(item)
    setShowAddForm(true)
  }

  const handleFormClose = () => {
    setShowAddForm(false)
    setEditingItem(null)
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
          <h2 className="text-3xl font-bold tracking-tight">{t("portfolioList")}</h2>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" />
            {t("addNewPortfolioItem")}
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <PortfolioGrid onEdit={handleEdit} />
        </motion.div>
      </div>

      {showAddForm && <PortfolioItemForm onClose={handleFormClose} editItem={editingItem} />}
    </div>
  )
}

