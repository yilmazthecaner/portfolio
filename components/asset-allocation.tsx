"use client"

import { useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useTranslation } from "@/context/translation-context"

const COLORS = [
  "hsl(var(--chart-primary))",
  "hsl(var(--chart-secondary))",
  "hsl(var(--chart-tertiary))",
  "hsl(var(--chart-quaternary))",
  "hsl(var(--chart-quinary))",
  "hsl(var(--chart-senary))",
]

const data = [
  { name: "Stocks", value: 25000 },
  { name: "Bonds", value: 8000 },
  { name: "Cash", value: 5231.89 },
  { name: "Real Estate", value: 4000 },
  { name: "Crypto", value: 3000 },
]

const assetTranslations = {
  tr: {
    Stocks: "Hisseler",
    Bonds: "Tahviller",
    Cash: "Nakit",
    "Real Estate": "Gayrimenkul",
    Crypto: "Kripto",
  },
  en: {
    Stocks: "Stocks",
    Bonds: "Bonds",
    Cash: "Cash",
    "Real Estate": "Real Estate",
    Crypto: "Crypto",
  },
}

export function AssetAllocation({
  detailed = false,
  hideValues = false,
}: { detailed?: boolean; hideValues?: boolean }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const { t, language } = useTranslation()

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  const onPieLeave = () => {
    setActiveIndex(null)
  }

  const totalValue = data.reduce((sum, item) => sum + item.value, 0)

  // Translate asset names
  const localizedData = data.map((item) => ({
    ...item,
    name: assetTranslations[language][item.name as keyof typeof assetTranslations.en],
  }))

  const chartData = hideValues
    ? localizedData.map((item) => ({ ...item, value: (item.value / totalValue) * 100 }))
    : localizedData

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={detailed ? 250 : 300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            innerRadius={detailed ? 50 : 40}
            fill="#8884d8"
            dataKey="value"
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                opacity={activeIndex === null || activeIndex === index ? 1 : 0.6}
                stroke="none"
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => {
              if (hideValues) return ["•••••", t("value")]
              return [`$${value.toLocaleString()}`, t("value")]
            }}
            contentStyle={{
              backgroundColor: "var(--background)",
              borderColor: "var(--border)",
              borderRadius: "0.5rem",
            }}
            itemStyle={{ color: "var(--foreground)" }}
            labelStyle={{ color: "var(--foreground)" }}
          />
          <Legend formatter={(value) => <span className="text-foreground">{value}</span>} />
        </PieChart>
      </ResponsiveContainer>

      {detailed && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("asset")}</TableHead>
              <TableHead>{t("value")}</TableHead>
              <TableHead className="text-right">{t("allocation")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {localizedData.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    {item.name}
                  </div>
                </TableCell>
                <TableCell>{hideValues ? "•••••" : `$${item.value.toLocaleString()}`}</TableCell>
                <TableCell className="text-right">{((item.value / totalValue) * 100).toFixed(1)}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

