import { type NextRequest, NextResponse } from "next/server"
import type { Transaction, TransactionFormData as BaseTransactionFormData } from "@/types/transaction"

interface TransactionFormData extends BaseTransactionFormData {
  transferDirection?: "send" | "receive"
}
import { v4 as uuidv4 } from "uuid"

// Import the current user to update budget
import { currentUser } from "../user/route"

// Mock database for demo purposes
export const transactions: Transaction[] = [
  {
    id: "t1",
    type: "buy",
    asset: "AAPL",
    amount: 5,
    price: 178.72,
    value: 893.6,
    date: "2023-12-01T10:30:00Z",
    status: "completed",
    userId: "user1",
  },
  {
    id: "t2",
    type: "sell",
    asset: "TSLA",
    amount: 2,
    price: 235.45,
    value: 470.9,
    date: "2023-11-28T14:15:00Z",
    status: "completed",
    userId: "user1",
  },
  {
    id: "t3",
    type: "buy",
    asset: "MSFT",
    amount: 3,
    price: 378.33,
    value: 1134.99,
    date: "2023-11-25T09:45:00Z",
    status: "completed",
    userId: "user1",
  },
  {
    id: "t4",
    type: "transfer",
    asset: "USD",
    amount: 1000,
    price: 1,
    value: 1000,
    date: "2023-11-20T16:20:00Z",
    status: "completed",
    userId: "user1",
  },
  {
    id: "t5",
    type: "buy",
    asset: "NVDA",
    amount: 2,
    price: 487.21,
    value: 974.42,
    date: "2023-11-15T11:10:00Z",
    status: "completed",
    userId: "user1",
  },
  {
    id: "t6",
    type: "sell",
    asset: "AMZN",
    amount: 4,
    price: 146.88,
    value: 587.52,
    date: "2023-11-10T13:25:00Z",
    status: "completed",
    userId: "user1",
  },
  {
    id: "t7",
    type: "buy",
    asset: "GOOGL",
    amount: 3,
    price: 134.99,
    value: 404.97,
    date: "2023-11-05T15:30:00Z",
    status: "completed",
    userId: "user1",
  },
]

// GET handler for fetching transactions
export async function GET(request: NextRequest) {
  try {
    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get("type")
    const asset = searchParams.get("asset")
    const dateFrom = searchParams.get("dateFrom")
    const dateTo = searchParams.get("dateTo")
    const status = searchParams.get("status")

    // Apply filters if provided
    let filteredTransactions = [...transactions]

    if (type && type !== "all") {
      filteredTransactions = filteredTransactions.filter((t) => t.type === type)
    }

    if (asset) {
      filteredTransactions = filteredTransactions.filter((t) => t.asset === asset)
    }

    if (dateFrom) {
      filteredTransactions = filteredTransactions.filter((t) => new Date(t.date) >= new Date(dateFrom))
    }

    if (dateTo) {
      filteredTransactions = filteredTransactions.filter((t) => new Date(t.date) <= new Date(dateTo))
    }

    if (status && status !== "all") {
      filteredTransactions = filteredTransactions.filter((t) => t.status === status)
    }

    // Sort by date (newest first)
    filteredTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Ensure we're returning JSON with the correct content type
    return new NextResponse(JSON.stringify(filteredTransactions), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error processing GET request:", error)
    return new NextResponse(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}

// Update the POST handler to properly handle transfer direction
export async function POST(request: NextRequest) {
  try {
    const data: TransactionFormData = await request.json()

    // Set default transferDirection if not provided for transfers
    if (data.type === "transfer" && !data.transferDirection) {
      data.transferDirection = "send"
    }

    // Validate required fields
    if (!data.type || !data.asset || !data.amount || data.amount <= 0 || data.price <= 0) {
      return NextResponse.json(
        { message: "Missing or invalid required fields" },
        { status: 400, headers: { "Content-Type": "application/json" } },
      )
    }

    // For send transfers and buy transactions, check if user has enough funds
    if ((data.type === "transfer" && data.transferDirection === "send") || data.type === "buy") {
      const transactionValue = data.amount * (data.type === "transfer" ? 1 : data.price)
      if (transactionValue > currentUser.budget.cash) {
        return NextResponse.json(
          { message: "Insufficient funds to complete this transaction" },
          { status: 400, headers: { "Content-Type": "application/json" } },
        )
      }
    }

    // Calculate transaction value
    const value = data.amount * data.price

    // Create new transaction
    const newTransaction: Transaction = {
      id: uuidv4(),
      type: data.type,
      asset: data.asset,
      amount: data.amount,
      price: data.price,
      value: value,
      date: new Date().toISOString(),
      status: "completed",
      userId: "user1", // In a real app, this would come from authentication
      transferDirection: data.transferDirection, // Store the direction for transfers
    }

    // Update user's budget based on transaction type
    if (data.type === "buy") {
      // Buying reduces cash and increases investments
      currentUser.budget.cash -= value
      currentUser.budget.investments += value

      // Increment active positions if it's a new asset
      const existingAsset = transactions.some(
        (t) => t.asset === data.asset && t.userId === "user1" && t.type === "buy" && t.status === "completed",
      )

      if (!existingAsset) {
        currentUser.budget.activePositions += 1
      }
    } else if (data.type === "sell") {
      // Selling increases cash and decreases investments
      currentUser.budget.cash += value
      currentUser.budget.investments -= value

      // Check if this was the last of this asset
      const remainingAmount =
        transactions
          .filter((t) => t.asset === data.asset && t.userId === "user1")
          .reduce((total, t) => {
            if (t.type === "buy") return total + t.amount
            if (t.type === "sell") return total - t.amount
            return total
          }, 0) - data.amount

      if (remainingAmount <= 0) {
        currentUser.budget.activePositions = Math.max(0, currentUser.budget.activePositions - 1)
      }
    } else if (data.type === "transfer") {
      // Handle transfer transactions based on transferDirection
      if (data.transferDirection === "send") {
        currentUser.budget.cash -= value // Sending money: deduct cash
      } else if (data.transferDirection === "receive") {
        currentUser.budget.cash += value // Receiving money: add cash
      } else {
        // Fallback behavior if transferDirection is not provided
        currentUser.budget.cash += value
      }
    }

    // Update total balance
    currentUser.budget.totalBalance = currentUser.budget.cash + currentUser.budget.investments

    // Add to our mock database
    transactions.unshift(newTransaction)

    return NextResponse.json(newTransaction, {
      status: 201,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error creating transaction:", error)
    return NextResponse.json(
      { message: "Failed to create transaction" },
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}

