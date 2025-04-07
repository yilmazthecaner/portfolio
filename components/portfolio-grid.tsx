"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "@/context/translation-context"
import { useToast } from "@/components/ui/use-toast"
import { ChevronDown, ChevronUp, Filter, MoreHorizontal, Pencil, Search, Trash2, X } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Mock portfolio data
const initialPortfolioData = [
  {
    id: "p1",
    name: "Retirement Fund",
    type: "Long-term",
    totalValue: 125000,
    currency: "USD",
    riskLevel: "Medium",
    returnRate: 8.5,
    lastUpdated: "2024-03-15T10:30:00Z",
    assets: [
      { symbol: "AAPL", allocation: 15 },
      { symbol: "MSFT", allocation: 12 },
      { symbol: "GOOGL", allocation: 10 },
      { symbol: "BND", allocation: 40 },
      { symbol: "VTI", allocation: 23 },
    ],
  },
  {
    id: "p2",
    name: "Growth Portfolio",
    type: "Medium-term",
    totalValue: 75000,
    currency: "USD",
    riskLevel: "High",
    returnRate: 12.3,
    lastUpdated: "2024-03-18T14:15:00Z",
    assets: [
      { symbol: "TSLA", allocation: 20 },
      { symbol: "NVDA", allocation: 25 },
      { symbol: "AMZN", allocation: 20 },
      { symbol: "META", allocation: 15 },
      { symbol: "QQQ", allocation: 20 },
    ],
  },
  {
    id: "p3",
    name: "Dividend Income",
    type: "Income",
    totalValue: 95000,
    currency: "USD",
    riskLevel: "Low",
    returnRate: 5.2,
    lastUpdated: "2024-03-17T09:45:00Z",
    assets: [
      { symbol: "JNJ", allocation: 15 },
      { symbol: "PG", allocation: 15 },
      { symbol: "KO", allocation: 15 },
      { symbol: "VYM", allocation: 30 },
      { symbol: "SCHD", allocation: 25 },
    ],
  },
  {
    id: "p4",
    name: "Tech Sector Focus",
    type: "Sector",
    totalValue: 45000,
    currency: "USD",
    riskLevel: "Very High",
    returnRate: 15.7,
    lastUpdated: "2024-03-16T11:10:00Z",
    assets: [
      { symbol: "AAPL", allocation: 20 },
      { symbol: "MSFT", allocation: 20 },
      { symbol: "NVDA", allocation: 20 },
      { symbol: "AMD", allocation: 15 },
      { symbol: "INTC", allocation: 10 },
      { symbol: "TSM", allocation: 15 },
    ],
  },
  {
    id: "p5",
    name: "Conservative Mix",
    type: "Long-term",
    totalValue: 150000,
    currency: "USD",
    riskLevel: "Low",
    returnRate: 4.8,
    lastUpdated: "2024-03-14T13:25:00Z",
    assets: [
      { symbol: "BND", allocation: 40 },
      { symbol: "VTIP", allocation: 20 },
      { symbol: "VTI", allocation: 20 },
      { symbol: "VXUS", allocation: 10 },
      { symbol: "GLD", allocation: 10 },
    ],
  },
  {
    id: "p6",
    name: "International Exposure",
    type: "Geographic",
    totalValue: 65000,
    currency: "USD",
    riskLevel: "Medium",
    returnRate: 7.9,
    lastUpdated: "2024-03-13T15:30:00Z",
    assets: [
      { symbol: "VXUS", allocation: 40 },
      { symbol: "EWJ", allocation: 15 },
      { symbol: "FXI", allocation: 15 },
      { symbol: "EWG", allocation: 15 },
      { symbol: "EWU", allocation: 15 },
    ],
  },
  {
    id: "p7",
    name: "ESG Focus",
    type: "Thematic",
    totalValue: 55000,
    currency: "USD",
    riskLevel: "Medium",
    returnRate: 6.5,
    lastUpdated: "2024-03-12T16:20:00Z",
    assets: [
      { symbol: "ESGU", allocation: 40 },
      { symbol: "ESGD", allocation: 30 },
      { symbol: "ESGE", allocation: 30 },
    ],
  },
  {
    id: "p8",
    name: "Short-term Trading",
    type: "Short-term",
    totalValue: 25000,
    currency: "USD",
    riskLevel: "Very High",
    returnRate: 22.3,
    lastUpdated: "2024-03-19T08:45:00Z",
    assets: [
      { symbol: "TSLA", allocation: 30 },
      { symbol: "COIN", allocation: 20 },
      { symbol: "MSTR", allocation: 20 },
      { symbol: "GME", allocation: 15 },
      { symbol: "AMC", allocation: 15 },
    ],
  },
  {
    id: "p9",
    name: "Bond Portfolio",
    type: "Income",
    totalValue: 110000,
    currency: "USD",
    riskLevel: "Very Low",
    returnRate: 3.2,
    lastUpdated: "2024-03-11T10:15:00Z",
    assets: [
      { symbol: "BND", allocation: 25 },
      { symbol: "VTIP", allocation: 25 },
      { symbol: "MUB", allocation: 25 },
      { symbol: "TLT", allocation: 25 },
    ],
  },
  {
    id: "p10",
    name: "Emerging Markets",
    type: "Geographic",
    totalValue: 40000,
    currency: "USD",
    riskLevel: "High",
    returnRate: 9.7,
    lastUpdated: "2024-03-10T14:50:00Z",
    assets: [
      { symbol: "VWO", allocation: 40 },
      { symbol: "IEMG", allocation: 30 },
      { symbol: "EEM", allocation: 30 },
    ],
  },
]

interface PortfolioGridProps {
  onEdit: (item: any) => void
}

export function PortfolioGrid({ onEdit }: PortfolioGridProps) {
  const { t } = useTranslation()
  const { toast } = useToast()

  // State for portfolio data
  const [portfolioData, setPortfolioData] = useState<any[]>([])

  // State for grid functionality
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [sortField, setSortField] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [showFilters, setShowFilters] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)

  // Load portfolio data from localStorage or use initial data
  useEffect(() => {
    const savedData = localStorage.getItem("portfolioData")
    if (savedData) {
      try {
        setPortfolioData(JSON.parse(savedData))
      } catch (e) {
        console.error("Failed to parse portfolio data from localStorage", e)
        setPortfolioData(initialPortfolioData)
        localStorage.setItem("portfolioData", JSON.stringify(initialPortfolioData))
      }
    } else {
      setPortfolioData(initialPortfolioData)
      localStorage.setItem("portfolioData", JSON.stringify(initialPortfolioData))
    }
  }, [])

  // Save portfolio data to localStorage whenever it changes
  useEffect(() => {
    if (portfolioData.length > 0) {
      localStorage.setItem("portfolioData", JSON.stringify(portfolioData))
    }
  }, [portfolioData])

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Handle filtering
  const handleFilterChange = (field: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value === "all" ? undefined : value,
    }))
    setCurrentPage(1) // Reset to first page when filter changes
  }

  // Handle deleting a portfolio item
  const handleDelete = (id: string) => {
    setItemToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (itemToDelete) {
      setPortfolioData((prev) => prev.filter((item) => item.id !== itemToDelete))
      toast({
        title: t("itemDeleted"),
        description: t("portfolioItemDeletedDesc"),
      })
    }
    setDeleteDialogOpen(false)
    setItemToDelete(null)
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Apply filters and search
  const filteredData = portfolioData.filter((item) => {
    // Apply search term
    if (
      searchTerm &&
      !item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !item.type.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false
    }

    // Apply filters
    for (const [key, value] of Object.entries(filters)) {
      if (value && item[key] !== value) {
        return false
      }
    }

    return true
  })

  // Apply sorting
  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    // Handle string comparison
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    // Handle number comparison
    return sortDirection === "asc" ? aValue - bValue : bValue - aValue
  })

  // Apply pagination
  const paginatedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // Calculate total pages
  const totalPages = Math.ceil(sortedData.length / pageSize)

  // Generate pagination items
  const getPaginationItems = () => {
    const items = []

    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink onClick={() => setCurrentPage(1)} isActive={currentPage === 1}>
          1
        </PaginationLink>
      </PaginationItem>,
    )

    // Show ellipsis if needed
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis1">
          <PaginationEllipsis />
        </PaginationItem>,
      )
    }

    // Show current page and surrounding pages
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i === 1 || i === totalPages) continue // Skip first and last page as they're always shown

      items.push(
        <PaginationItem key={i}>
          <PaginationLink onClick={() => setCurrentPage(i)} isActive={currentPage === i}>
            {i}
          </PaginationLink>
        </PaginationItem>,
      )
    }

    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis2">
          <PaginationEllipsis />
        </PaginationItem>,
      )
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink onClick={() => setCurrentPage(totalPages)} isActive={currentPage === totalPages}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      )
    }

    return items
  }

  // Get unique values for filter dropdowns
  const getUniqueValues = (field: string) => {
    const values = new Set(portfolioData.map((item) => item[field]))
    return Array.from(values)
  }

  // Risk level badge color
  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "Very Low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "High":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
      case "Very High":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      default:
        return ""
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>{t("portfolioItems")}</CardTitle>
              <CardDescription>{t("manageYourPortfolios")}</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("searchPortfolios")}
                  className="pl-8 w-[200px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? "bg-muted" : ""}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 p-4 border rounded-lg bg-muted/50">
              <div>
                <label className="text-sm font-medium block mb-2">{t("type")}</label>
                <Select value={filters.type || "all"} onValueChange={(value) => handleFilterChange("type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("allTypes")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allTypes")}</SelectItem>
                    {getUniqueValues("type").map((type) => (
                      <SelectItem key={type as string} value={type as string}>
                        {type as string}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">{t("riskLevel")}</label>
                <Select
                  value={filters.riskLevel || "all"}
                  onValueChange={(value) => handleFilterChange("riskLevel", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("allRiskLevels")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allRiskLevels")}</SelectItem>
                    {getUniqueValues("riskLevel").map((risk) => (
                      <SelectItem key={risk as string} value={risk as string}>
                        {risk as string}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilters({})
                    setSearchTerm("")
                  }}
                  className="flex items-center"
                >
                  <X className="mr-2 h-4 w-4" />
                  {t("clearFilters")}
                </Button>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                    <div className="flex items-center">
                      {t("name")}
                      {sortField === "name" &&
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
                  <TableHead className="cursor-pointer text-right" onClick={() => handleSort("totalValue")}>
                    <div className="flex items-center justify-end">
                      {t("totalValue")}
                      {sortField === "totalValue" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        ))}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer text-right" onClick={() => handleSort("returnRate")}>
                    <div className="flex items-center justify-end">
                      {t("returnRate")}
                      {sortField === "returnRate" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        ))}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("riskLevel")}>
                    <div className="flex items-center">
                      {t("riskLevel")}
                      {sortField === "riskLevel" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        ))}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("lastUpdated")}>
                    <div className="flex items-center">
                      {t("lastUpdated")}
                      {sortField === "lastUpdated" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        ))}
                    </div>
                  </TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {t("noPortfolioItemsFound")}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((item) => (
                    <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell className="text-right">${item.totalValue.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{item.returnRate}%</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getRiskBadgeColor(item.riskLevel)}>
                          {item.riskLevel}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(item.lastUpdated)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">{t("actions")}</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit(item)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              {t("edit")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDelete(item.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              {t("delete")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                {t("showing")} {Math.min((currentPage - 1) * pageSize + 1, sortedData.length)} -{" "}
                {Math.min(currentPage * pageSize, sortedData.length)} {t("of")} {sortedData.length}
              </p>
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => {
                  setPageSize(Number.parseInt(value))
                  setCurrentPage(1) // Reset to first page when page size changes
                }}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 / {t("page")}</SelectItem>
                  <SelectItem value="10">10 / {t("page")}</SelectItem>
                  <SelectItem value="20">20 / {t("page")}</SelectItem>
                  <SelectItem value="50">50 / {t("page")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    isDisabled={currentPage === 1}
                  />
                </PaginationItem>

                {getPaginationItems()}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    isDisabled={currentPage === totalPages || totalPages === 0}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirmDeletion")}</AlertDialogTitle>
            <AlertDialogDescription>{t("deletePortfolioItemConfirmation")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

