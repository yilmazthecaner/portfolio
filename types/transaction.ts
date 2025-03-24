export type TransactionType = "buy" | "sell" | "transfer"
export type TransactionStatus = "completed" | "pending" | "failed"

export interface Transaction {
  id: string
  type: TransactionType
  asset: string
  amount: number
  price: number
  value: number
  date: string
  status: TransactionStatus
  userId: string
  notes?: string
  fee?: number
}

export interface TransactionFormData {
  type: TransactionType
  asset: string
  amount: number
  price: number
}

export interface TransactionFilters {
  type?: TransactionType
  asset?: string
  dateFrom?: string
  dateTo?: string
  status?: TransactionStatus
}

export interface TransactionSummary {
  totalBuy: number
  totalSell: number
  totalTransfer: number
  netValue: number
  count: number
}

