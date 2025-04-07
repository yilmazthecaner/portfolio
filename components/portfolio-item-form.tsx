"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { X, Plus, Minus, Save, Loader2 } from "lucide-react"
import { useTranslation } from "@/context/translation-context"
import { useToast } from "@/components/ui/use-toast"
import { v4 as uuidv4 } from "uuid"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AssetSymbolSelector } from "@/components/asset-symbol-selector"

interface PortfolioItemFormProps {
  onClose: () => void
  editItem?: any
}

export function PortfolioItemForm({ onClose, editItem }: PortfolioItemFormProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()
  const { toast } = useToast()

  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    type: "",
    totalValue: 0,
    currency: "USD",
    riskLevel: "",
    returnRate: 0,
    lastUpdated: new Date().toISOString(),
    assets: [{ symbol: "", allocation: 0 }],
  })

  // Initialize form with edit data if provided
  useEffect(() => {
    if (editItem) {
      setFormData({
        ...editItem,
        // Ensure we have a deep copy of assets
        assets: [...editItem.assets],
      })
    } else {
      // Generate a new ID for new items
      setFormData((prev) => ({
        ...prev,
        id: uuidv4(),
      }))
    }
  }, [editItem])

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

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Handle numeric inputs
    if (name === "totalValue" || name === "returnRate") {
      // Remove leading zeros and handle decimal values properly
      let cleanedValue = value

      // If it starts with 0 and has more digits, remove the leading zero
      // unless it's a decimal (0.xx)
      if (value.length > 1 && value.startsWith("0") && value.charAt(1) !== ".") {
        cleanedValue = value.replace(/^0+/, "")
      }

      // If it's just "0", keep it
      if (cleanedValue === "") {
        cleanedValue = "0"
      }

      setFormData((prev) => ({
        ...prev,
        [name]: Number.parseFloat(cleanedValue) || 0,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  // Add focus handlers for numeric inputs to improve UX
  // Add these functions after the handleChange function
  const handleFocusNumericInput = (e: React.FocusEvent<HTMLInputElement>) => {
    // When focusing on a numeric input with value 0, clear it for easier entry
    if (e.target.value === "0") {
      e.target.value = ""
    }
  }

  const handleBlurNumericInput = (e: React.FocusEvent<HTMLInputElement>, fieldName: string) => {
    // When leaving the field, if it's empty, set it back to 0
    if (e.target.value === "") {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: 0,
      }))
    }
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

    // Handle asset changes
    const handleAssetChange = (index: number, field: "symbol" | "allocation", value: any) => {
      const newAssets = [...formData.assets]
   
      if (field === "allocation") {
        newAssets[index][field] = Number.parseFloat(value) || 0
      } else {
        newAssets[index][field] = value
      }
   
      setFormData((prev) => ({
        ...prev,
        assets: newAssets,
      }))
    }

  // Add new asset
  const addAsset = () => {
    setFormData((prev) => ({
      ...prev,
      assets: [...prev.assets, { symbol: "", allocation: 0 }],
    }))
  }

  // Remove asset
  const removeAsset = (index: number) => {
    if (formData.assets.length <= 1) return

    const newAssets = [...formData.assets]
    newAssets.splice(index, 1)

    setFormData((prev) => ({
      ...prev,
      assets: newAssets,
    }))
  }

  // Calculate total allocation
  const totalAllocation = formData.assets.reduce((sum, asset) => sum + asset.allocation, 0)

  // Save portfolio item
  const handleSave = () => {
    // Validate form
    if (!formData.name.trim()) {
      toast({
        title: t("validationError"),
        description: t("nameIsRequired"),
        variant: "destructive",
      })
      return
    }

    if (!formData.type) {
      toast({
        title: t("validationError"),
        description: t("typeIsRequired"),
        variant: "destructive",
      })
      return
    }

    if (!formData.riskLevel) {
      toast({
        title: t("validationError"),
        description: t("riskLevelIsRequired"),
        variant: "destructive",
      })
      return
    }

    if (formData.totalValue <= 0) {
      toast({
        title: t("validationError"),
        description: t("totalValueMustBePositive"),
        variant: "destructive",
      })
      return
    }

    // Validate assets
    const invalidAssets = formData.assets.some((asset) => !asset.symbol.trim() || asset.allocation <= 0)
    if (invalidAssets) {
      toast({
        title: t("validationError"),
        description: t("allAssetsMustBeValid"),
        variant: "destructive",
      })
      return
    }

    // Check total allocation
    if (Math.abs(totalAllocation - 100) > 0.01) {
      toast({
        title: t("validationError"),
        description: t("totalAllocationMustBe100"),
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      try {
        // Get existing data from localStorage
        const savedData = localStorage.getItem("portfolioData")
        let portfolioData = []

        if (savedData) {
          portfolioData = JSON.parse(savedData)
        }

        // Update lastUpdated timestamp
        const updatedItem = {
          ...formData,
          lastUpdated: new Date().toISOString(),
        }

        // Check if we're editing or adding
        if (editItem) {
          // Update existing item
          const index = portfolioData.findIndex((item: any) => item.id === editItem.id)
          if (index !== -1) {
            portfolioData[index] = updatedItem
          }
        } else {
          // Add new item
          portfolioData.push(updatedItem)
        }

        // Save to localStorage
        localStorage.setItem("portfolioData", JSON.stringify(portfolioData))

        toast({
          title: editItem ? t("portfolioItemUpdated") : t("portfolioItemAdded"),
          description: editItem ? t("portfolioItemUpdatedDesc") : t("portfolioItemAddedDesc"),
        })

        onClose()
      } catch (error) {
        console.error("Error saving portfolio item:", error)
        toast({
          title: t("saveFailed"),
          description: t("saveFailedDesc"),
          variant: "destructive",
        })
      } finally {
        setIsSaving(false)
      }
    }, 500)
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <Card>
          <CardHeader className="sticky top-0 z-10 bg-card border-b">
            <div className="flex items-center justify-between">
              <CardTitle>{editItem ? t("editPortfolioItem") : t("addNewPortfolioItem")}</CardTitle>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">{t("name")} *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t("enterPortfolioName")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">{t("type")} *</Label>
                <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectPortfolioType")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Long-term">{t("longTerm")}</SelectItem>
                    <SelectItem value="Medium-term">{t("mediumTerm")}</SelectItem>
                    <SelectItem value="Short-term">{t("shortTerm")}</SelectItem>
                    <SelectItem value="Income">{t("income")}</SelectItem>
                    <SelectItem value="Sector">{t("sector")}</SelectItem>
                    <SelectItem value="Geographic">{t("geographic")}</SelectItem>
                    <SelectItem value="Thematic">{t("thematic")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalValue">{t("totalValue")} *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5">$</span>
                  <Input
                    id="totalValue"
                    name="totalValue"
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.totalValue || ""}
                    onChange={handleChange}
                    onFocus={handleFocusNumericInput}
                    onBlur={(e) => handleBlurNumericInput(e, "totalValue")}
                    className="pl-7"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">{t("currency")}</Label>
                <Select value={formData.currency} onValueChange={(value) => handleSelectChange("currency", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="JPY">JPY</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="riskLevel">{t("riskLevel")} *</Label>
                <Select value={formData.riskLevel} onValueChange={(value) => handleSelectChange("riskLevel", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectRiskLevel")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Very Low">{t("veryLow")}</SelectItem>
                    <SelectItem value="Low">{t("low")}</SelectItem>
                    <SelectItem value="Medium">{t("medium")}</SelectItem>
                    <SelectItem value="High">{t("high")}</SelectItem>
                    <SelectItem value="Very High">{t("veryHigh")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="returnRate">{t("returnRate")} (%)</Label>
                <Input
                  id="returnRate"
                  name="returnRate"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.returnRate || ""}
                  onChange={handleChange}
                  onFocus={handleFocusNumericInput}
                  onBlur={(e) => handleBlurNumericInput(e, "returnRate")}
                />
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">{t("assets")}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant={Math.abs(totalAllocation - 100) <= 0.01 ? "outline" : "destructive"}>
                    {t("totalAllocation")}: {totalAllocation.toFixed(1)}%
                  </Badge>
                  <Button variant="outline" size="sm" onClick={addAsset} className="h-8">
                    <Plus className="mr-1 h-3 w-3" />
                    {t("addAsset")}
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {formData.assets.map((asset, index) => (
                  <div key={index} className="flex items-end gap-4">
                    <div className="flex-1 space-y-2">
                      <Label>{t("symbol")}</Label>
                      <AssetSymbolSelector
                        value={asset.symbol}
                        onChange={(value) => handleAssetChange(index, "symbol", value)}
                      />
                    </div>
                    <div className="w-32 space-y-2">
                      <Label>{t("allocation")} (%)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={asset.allocation || ""}
                        onChange={(e) => handleAssetChange(index, "allocation", e.target.value)}
                        onFocus={handleFocusNumericInput}
                        onBlur={(e) => {
                          if (e.target.value === "") {
                            handleAssetChange(index, "allocation", 0)
                          }
                        }}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAsset(index)}
                      disabled={formData.assets.length <= 1}
                      className="h-10 w-10"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between border-t p-4">
            <Button variant="outline" onClick={onClose}>
              {t("cancel")}
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("saving")}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {t("save")}
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

