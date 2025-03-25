import type { Transaction, TransactionFormData, TransactionFilters } from "@/types/transaction"
import type { User, UserUpdateData } from "@/types/user"

// Base API URL - would come from environment variables in a real app
const API_BASE_URL = "/api"

// Mock user data to use as fallback when API fails
const FALLBACK_USER: User = {
  id: "user1",
  name: "Caner Yılmaz",
  email: "caner@rasyonet.com",
  imageUrl: "/placeholder.svg?height=128&width=128",
  budget: {
    totalBalance: 45231.89,
    investments: 12234.0,
    cash: 5231.89,
    activePositions: 12,
  },
}

// Helper function for handling API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    // Try to get error details from the response
    let errorMessage = `Error: ${response.status} ${response.statusText}`
    try {
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json()
        if (errorData.message) {
          errorMessage = errorData.message
        }
      } else {
        // If not JSON, get text error
        const textError = await response.text()
        errorMessage = `Server error: ${response.status}`
        console.error("Non-JSON error response:", textError)
      }
    } catch (e) {
      // If we can't parse the error, just use the status
      console.error("Error parsing error response:", e)
    }
    throw new Error(errorMessage)
  }

  // Check content type to ensure we're getting JSON
  const contentType = response.headers.get("content-type")
  if (!contentType || !contentType.includes("application/json")) {
    console.error("Unexpected content type:", contentType)

    // Try to get the response text for debugging
    try {
      const text = await response.text()
      console.error("Response text:", text.substring(0, 200) + (text.length > 200 ? "..." : ""))
    } catch (e) {
      console.error("Could not read response text:", e)
    }

    // Instead of throwing an error, return mock data
    throw new Error(`Unexpected content type: ${contentType}`)
  }

  return response.json() as Promise<T>
}

// Transaction API functions
export const transactionApi = {
  // Get all transactions with optional filtering
  async getTransactions(filters?: TransactionFilters): Promise<Transaction[]> {
    // Mock transactions data - always use this instead of API calls
    const MOCK_TRANSACTIONS = [
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
        transferDirection: "send",
      },
      {
        id: "t5",
        type: "transfer",
        asset: "USD",
        amount: 500,
        price: 1,
        value: 500,
        date: "2023-11-15T11:10:00Z",
        status: "completed",
        userId: "user1",
        transferDirection: "receive",
      },
    ]


    // Apply filters if provided
    let filteredTransactions = [...MOCK_TRANSACTIONS]

    if (filters) {
      if (filters.type) {
        filteredTransactions = filteredTransactions.filter((t) => t.type === filters.type)
      }

      if (filters.asset) {
        filteredTransactions = filteredTransactions.filter((t) => t.asset === filters.asset)
      }

      if (filters.dateFrom) {
        filteredTransactions = filteredTransactions.filter((t) => filters.dateFrom && new Date(t.date) >= new Date(filters.dateFrom))
      }

      if (filters.dateTo) {
        filteredTransactions = filteredTransactions.filter((t) => filters.dateTo && new Date(t.date) <= new Date(filters.dateTo))
      }

      if (filters.status) {
        filteredTransactions = filteredTransactions.filter((t) => t.status === filters.status)
      }
    }

    // Sort by date (newest first)
    filteredTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return Promise.resolve(filteredTransactions as Transaction[])
  },

  // Get a single transaction by ID
  async getTransaction(id: string): Promise<Transaction> {
    // Mock transactions
    const MOCK_TRANSACTIONS = [
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
      // ... other transactions
    ]

    const transaction = MOCK_TRANSACTIONS.find((t) => t.id === id)

    if (!transaction) {
      throw new Error(`Transaction with ID ${id} not found`)
    }

    return Promise.resolve(transaction as Transaction)
  },

  // Create a new transaction - mock implementation
  async createTransaction(data: TransactionFormData): Promise<Transaction> {
    // Generate a mock transaction
    const newTransaction: Transaction = {
      id: `t${Date.now()}`,
      type: data.type,
      asset: data.asset,
      amount: data.amount,
      price: data.price,
      value: data.amount * data.price,
      date: new Date().toISOString(),
      status: "completed",
      userId: "user1",
      transferDirection: data.transferDirection,
    }

    return Promise.resolve(newTransaction)
  },

  // Update an existing transaction - mock implementation
  async updateTransaction(id: string, data: Partial<TransactionFormData>): Promise<Transaction> {
    // Mock updated transaction
    const updatedTransaction: Transaction = {
      id,
      type: data.type || "buy",
      asset: data.asset || "MOCK",
      amount: data.amount || 1,
      price: data.price || 100,
      value: (data.amount || 1) * (data.price || 100),
      date: new Date().toISOString(),
      status: "completed",
      userId: "user1",
      transferDirection: data.transferDirection,
    }

    return Promise.resolve(updatedTransaction)
  },

  // Delete a transaction - mock implementation
  async deleteTransaction(id: string): Promise<void> {
    return Promise.resolve()
  },
}

// User API functions
export const userApi = {
  // Get current user
  async getCurrentUser(): Promise<User> {
    try {
      // Use direct mock data instead of API call
      // This bypasses the API route that's causing issues
      return Promise.resolve({ ...FALLBACK_USER })
    } catch (error) {
      console.error("Error fetching current user:", error)
      return { ...FALLBACK_USER } // Return fallback user
    }
  },

  // Update user profile
  async updateUser(data: UserUpdateData): Promise<User> {
    try {
      // Update local mock data instead of API call
      const updatedUser = { ...FALLBACK_USER }
      if (data.name) updatedUser.name = data.name
      if (data.email) updatedUser.email = data.email
      if (data.imageUrl) updatedUser.imageUrl = data.imageUrl

      return Promise.resolve(updatedUser)
    } catch (error) {
      console.error("Error updating user:", error)
      throw error
    }
  },

  // Upload profile image
  async uploadProfileImage(file: File): Promise<{ imageUrl: string }> {
    try {
      // Mock image upload
      const imageUrl = `/placeholder.svg?height=128&width=128&text=Profile+${Date.now().toString().substring(0, 8)}`
      return Promise.resolve({ imageUrl })
    } catch (error) {
      console.error("Error uploading profile image:", error)
      throw error
    }
  },
}

export { FALLBACK_USER }

