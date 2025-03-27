import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import { translations } from "@/lib/translations"

// Get the current language from localStorage
const getCurrentLanguage = () => {
  if (typeof window === "undefined") return "tr"
  return (localStorage.getItem("preferredLanguage") as "tr" | "en") || "tr"
}

// Get translation function
const t = (key: string): string => {
  const language = getCurrentLanguage()
  return (
    (translations as Record<string, Record<string, string>>)[language][key] ||
    (translations as Record<string, Record<string, string>>).en[key] ||
    key
  )
}

export const generatePdfReport = async () => {
  // Create a new PDF document
  const doc = new jsPDF()
  const language = getCurrentLanguage()

  // Get user data
  const userName = "Caner Yılmaz"
  const currentDate = new Date().toLocaleDateString(language === "tr" ? "tr-TR" : "en-US")

  // Add header
  doc.setFontSize(20)
  doc.setTextColor(0, 0, 0)
  doc.text(t("portfolioReport"), 105, 20, { align: "center" })

  doc.setFontSize(12)
  doc.text(`${t("generatedOn")}: ${currentDate}`, 105, 30, { align: "center" })

  // Add portfolio summary
  doc.setFontSize(16)
  doc.text(t("portfolioSummary"), 14, 45)

  autoTable(doc, {
    startY: 50,
    head: [["", t("value")]],
    body: [
      [t("totalBalance"), "$45,231.89"],
      [t("investments"), "$12,234.00"],
      [t("cash"), "$5,231.89"],
      [t("activePositions"), "12"],
    ],
    theme: "grid",
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
  })

  // Add asset allocation
  doc.setFontSize(16)
  doc.text(t("assetSummary"), 14, (doc as any).lastAutoTable.finalY + 15)

  const assetData = [
    ["Stocks", "$25,000.00", "55.3%"],
    ["Bonds", "$8,000.00", "17.7%"],
    ["Cash", "$5,231.89", "11.6%"],
    ["Real Estate", "$4,000.00", "8.8%"],
    ["Crypto", "$3,000.00", "6.6%"],
  ]

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 20,
    head: [[t("asset"), t("value"), t("allocation")]],
    body: assetData,
    theme: "grid",
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
  })

  // Add transaction history
  doc.setFontSize(16)
  doc.text(t("transactionSummary"), 14, (doc as any).lastAutoTable.finalY + 15)

  const transactionData = [
    ["2023-12-01", t("bought"), "AAPL", "5", "$178.72", "$893.60"],
    ["2023-11-28", t("sold"), "TSLA", "2", "$235.45", "$470.90"],
    ["2023-11-25", t("bought"), "MSFT", "3", "$378.33", "$1,134.99"],
    ["2023-11-20", t("transferred"), "USD", "1000", "$1.00", "$1,000.00"],
    ["2023-11-15", t("bought"), "NVDA", "2", "$487.21", "$974.42"],
  ]

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 20,
    head: [[t("date"), t("type"), t("asset"), t("amount"), t("price"), t("total")]],
    body: transactionData,
    theme: "grid",
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
  })

  // Add footer
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(10)
    doc.text(`${t("prepared")}: ${userName}`, 14, doc.internal.pageSize.height - 10)
    doc.text(
      `${t("page")} ${i} ${t("of")} ${pageCount}`,
      doc.internal.pageSize.width - 20,
      doc.internal.pageSize.height - 10,
    )
  }

  // Save the PDF
  doc.save(`${userName} ${t("portfolioReport")} ${currentDate}.pdf`)
}

