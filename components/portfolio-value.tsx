"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useTranslation } from "@/context/translation-context";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const data = [
  { date: "2024-01-01", value: 10000 },
  { date: "2024-02-01", value: 17000 },
  { date: "2024-03-01", value: 23000 },
  { date: "2024-04-01", value: 18000 },
  { date: "2024-05-01", value: 28000 },
  { date: "2024-06-01", value: 30000 },
  { date: "2024-07-01", value: 32000 },
  { date: "2024-08-01", value: 31500 },
  { date: "2024-09-01", value: 30500 },
  { date: "2024-10-01", value: 35000 },
  { date: "2024-11-01", value: 38000 },
  { date: "2024-12-01", value: 42000.52 },
  { date: "2025-01-01", value: 45231.89 },
  { date: "2025-03-01", value: 33000 },
  { date: "2025-03-05", value: 25300 },
  { date: "2025-03-20", value: 17300 },
  { date: "2025-03-24", value: 31500 },
];

export function PortfolioValue({
  hideValues = false,
}: {
  hideValues?: boolean;
}) {
  const { t, language } = useTranslation();
  const [period, setPeriod] = useState("all");

  // filtering thresholds
  const now = new Date();
  const lastWeek = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 7
  );
  const lastMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate()
  );
  const lastYear = new Date(
    now.getFullYear() - 1,
    now.getMonth(),
    now.getDate()
  );

  const filteredData =
    period === "all"
      ? data
      : period === "last_week"
      ? data.filter((item) => new Date(item.date) >= lastWeek)
      : period === "last_month"
      ? data.filter((item) => new Date(item.date) >= lastMonth)
      : data.filter((item) => new Date(item.date) >= lastYear);

  const chartData = hideValues
    ? filteredData.map((item) => ({ date: item.date, value: null }))
    : filteredData;

  const formatDate = (date: string) => {
    const d = new Date(date);
    if (period === "all") {
      return language === "tr"
        ? `${d.toLocaleString("tr", { month: "long" })} ${d.getFullYear()}`
        : `${d.toLocaleString("en", { month: "long" })} ${d.getFullYear()}`;
    } else if (period === "last_year") {
      return language === "tr"
        ? d.toLocaleString("tr", { month: "long" })
        : d.toLocaleString("en", { month: "long" });
    } else if (period === "last_month") {
      return new Intl.DateTimeFormat(language === "tr" ? "tr-TR" : "en-US", {
        day: "numeric",
      }).format(d);
    } else if (period === "last_week") {
      return new Intl.DateTimeFormat(language === "tr" ? "tr-TR" : "en-US", {
        weekday: "short",
      }).format(d);
    }
    return d.toLocaleDateString();
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        {" "}
        <Select value={period} onValueChange={(value) => setPeriod(value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder={t("selectPeriod")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allTime")}</SelectItem>
            <SelectItem value="last_week">{t("lastWeek")}</SelectItem>{" "}
            <SelectItem value="last_month">{t("lastMonth")}</SelectItem>
            <SelectItem value="last_year">{t("lastYear")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            stroke="currentColor"
            className="text-muted-foreground"
          />
          <YAxis
            tickFormatter={(value) =>
              hideValues ? "•••" : `$${value / 1000}k`
            }
            stroke="currentColor"
            className="text-muted-foreground"
          />
          <Tooltip
            formatter={(value: number) =>
              hideValues
                ? ["•••••", t("portfolioValue")]
                : [`$${value.toLocaleString()}`, t("portfolioValue")]
            }
            labelFormatter={(label) =>
              `${t("date")}: ${new Date(label).toLocaleDateString(
                language === "tr" ? "tr-TR" : "en-US"
              )}`
            }
            contentStyle={{
              backgroundColor: "var(--background)",
              borderColor: "var(--border)",
              borderRadius: "0.5rem",
            }}
            itemStyle={{ color: "var(--foreground)" }}
            labelStyle={{ color: "var(--foreground)" }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            name={t("portfolioValue")}
            stroke="hsl(var(--chart-primary))"
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}
