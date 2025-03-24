"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { useTranslation } from "@/context/translation-context"

const data = [
  {
    name: "Jan",
    total: 18000,
  },
  {
    name: "Feb",
    total: 22000,
  },
  {
    name: "Mar",
    total: 25000,
  },
  {
    name: "Apr",
    total: 24000,
  },
  {
    name: "May",
    total: 28000,
  },
  {
    name: "Jun",
    total: 32000,
  },
  {
    name: "Jul",
    total: 38000,
  },
  {
    name: "Aug",
    total: 42000,
  },
  {
    name: "Sep",
    total: 45000,
  },
  {
    name: "Oct",
    total: 44000,
  },
  {
    name: "Nov",
    total: 48000,
  },
  {
    name: "Dec",
    total: 45231.89,
  },
]

export function Overview({ hideValues = false }: { hideValues?: boolean }) {
  const { t, language } = useTranslation()

  const monthNames = {
    tr: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"],
    en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  }

  const localizedData = data.map((item, index) => ({
    ...item,
    name: monthNames[language][index],
  }))

  const chartData = hideValues ? localizedData.map((item) => ({ ...item, total: null })) : localizedData

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
        <XAxis
          dataKey="name"
          stroke="currentColor"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          className="text-muted-foreground"
        />
        <YAxis
          stroke="currentColor"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => (hideValues ? "•••" : `$${value / 1000}k`)}
          className="text-muted-foreground"
        />
        <Tooltip
          formatter={(value: number) =>
            hideValues ? ["•••••", t("portfolioValue")] : [`$${value.toLocaleString()}`, t("portfolioValue")]
          }
          labelFormatter={(label) => `${t("month")}: ${label}`}
          contentStyle={{
            backgroundColor: "var(--background)",
            borderColor: "var(--border)",
            borderRadius: "0.5rem",
          }}
          itemStyle={{ color: "var(--foreground)" }}
          labelStyle={{ color: "var(--foreground)" }}
        />
        <Bar dataKey="total" fill="hsl(var(--chart-primary))" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  )
}

