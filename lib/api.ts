import type { Transaction, TransactionFormData, TransactionFilters } from "@/types/transaction"
import type { User, UserUpdateData } from "@/types/user"

// Base API URL - would come from environment variables in a real app
const API_BASE_URL = "/api"

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
    throw new Error("Server returned non-JSON response")
  }

  return response.json() as Promise<T>
}

// Transaction API functions
export const transactionApi = {
  // Get all transactions with optional filtering
  async getTransactions(filters?: TransactionFilters): Promise<Transaction[]> {
    try {
      // Build query string from filters
      const queryParams = new URLSearchParams()
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== "all") {
            queryParams.append(key, value.toString())
          }
        })
      }

      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ""
      const response = await fetch(`${API_BASE_URL}/transactions${queryString}`)
      return handleResponse<Transaction[]>(response)
    } catch (error) {
      console.error("Error fetching transactions:", error)
      throw error
    }
  },

  // Get a single transaction by ID
  async getTransaction(id: string): Promise<Transaction> {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${id}`)
      return handleResponse<Transaction>(response)
    } catch (error) {
      console.error(`Error fetching transaction ${id}:`, error)
      throw error
    }
  },

  // Create a new transaction
  async createTransaction(data: TransactionFormData): Promise<Transaction> {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      return handleResponse<Transaction>(response)
    } catch (error) {
      console.error("Error creating transaction:", error)
      throw error
    }
  },

  // Update an existing transaction
  async updateTransaction(id: string, data: Partial<TransactionFormData>): Promise<Transaction> {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      return handleResponse<Transaction>(response)
    } catch (error) {
      console.error(`Error updating transaction ${id}:`, error)
      throw error
    }
  },

  // Delete a transaction
  async deleteTransaction(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: "DELETE",
      })
      return handleResponse<void>(response)
    } catch (error) {
      console.error(`Error deleting transaction ${id}:`, error)
      throw error
    }
  },
}

// User API functions
export const userApi = {
  // Get current user
  async getCurrentUser(): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/user`)
      return handleResponse<User>(response)
    } catch (error) {
      console.error("Error fetching current user:", error)
      throw error
    }
  },

  // Update user profile
  async updateUser(data: UserUpdateData): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      return handleResponse<User>(response)
    } catch (error) {
      console.error("Error updating user:", error)
      throw error
    }
  },

  // Upload profile image
  async uploadProfileImage(file: File): Promise<{ imageUrl: string }> {
    try {
      const formData = new FormData()
      formData.append("image", file)

      const response = await fetch(`${API_BASE_URL}/user/image`, {
        method: "POST",
        body: formData,
      })
      return handleResponse<{ imageUrl: string }>(response)
    } catch (error) {
      console.error("Error uploading profile image:", error)
      throw error
    }
  },
}

