"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User, UserUpdateData } from "@/types/user"
import { userApi, FALLBACK_USER } from "@/lib/api"
import type { Transaction, TransactionFormData } from "@/types/transaction"
import { toast } from "@/components/ui/use-toast"

interface UserContextType {
  user: User | null
  loading: boolean
  error: string | null
  updateUser: (data: UserUpdateData) => Promise<User>
  uploadProfileImage: (file: File) => Promise<string>
  refreshUser: () => Promise<void>
  processTransaction: (transaction: TransactionFormData) => Promise<Transaction>
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  error: null,
  updateUser: async () => {
    throw new Error("UserContext not initialized")
  },
  uploadProfileImage: async () => {
    throw new Error("UserContext not initialized")
  },
  refreshUser: async () => {
    throw new Error("UserContext not initialized")
  },
  processTransaction: async () => {
    throw new Error("UserContext not initialized")
  },
})

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Improve error handling in the fetchUser function
  const fetchUser = async () => {
    try {
      setLoading(true)
      const userData = await userApi.getCurrentUser()
      setUser(userData)
      setError(null)
    } catch (err) {
      console.error("Error fetching user:", err)
      setError(err instanceof Error ? err.message : "Failed to load user data")

      // Provide a fallback user object to prevent UI errors
      if (!user) {
        setUser({ ...FALLBACK_USER })
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const updateUser = async (data: UserUpdateData): Promise<User> => {
    try {
      const updatedUser = await userApi.updateUser(data)
      setUser(updatedUser)
      return updatedUser
    } catch (err) {
      console.error("Error updating user:", err)
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile. Please try again.",
        variant: "destructive",
      })
      throw err
    }
  }

  const uploadProfileImage = async (file: File): Promise<string> => {
    try {
      const { imageUrl } = await userApi.uploadProfileImage(file)
      if (user) {
        setUser({ ...user, imageUrl })
      }
      return imageUrl
    } catch (err) {
      console.error("Error uploading profile image:", err)
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your image. Please try again.",
        variant: "destructive",
      })
      throw err
    }
  }

  const refreshUser = async (): Promise<void> => {
    await fetchUser()
  }

  const processTransaction = async (transaction: TransactionFormData): Promise<Transaction> => {
    try {
      // Validate transaction
      if (transaction.amount <= 0) {
        throw new Error("Amount must be greater than zero")
      }

      // For send transfers and buy transactions, check if user has enough funds
      if (
        user &&
        ((transaction.type === "transfer" && transaction.transferDirection === "send") || transaction.type === "buy")
      ) {
        const transactionValue = transaction.amount * (transaction.type === "transfer" ? 1 : transaction.price)
        if (transactionValue > user.budget.cash) {
          throw new Error("Insufficient funds to complete this transaction")
        }
      }

      // Create a mock transaction response instead of calling the API
      const result: Transaction = {
        id: `t${Date.now()}`,
        type: transaction.type,
        asset: transaction.asset,
        amount: transaction.amount,
        price: transaction.price,
        value: transaction.amount * (transaction.type === "transfer" ? 1 : transaction.price),
        date: new Date().toISOString(),
        status: "completed",
        userId: "user1",
        transferDirection: transaction.transferDirection,
      }

      // Update user data locally to reflect the transaction
      if (user) {
        const updatedUser = { ...user }

        // Update budget based on transaction type
        if (transaction.type === "buy") {
          const value = transaction.amount * transaction.price
          updatedUser.budget.cash -= value
          updatedUser.budget.investments += value
        } else if (transaction.type === "sell") {
          const value = transaction.amount * transaction.price
          updatedUser.budget.cash += value
          updatedUser.budget.investments -= value
        } else if (transaction.type === "transfer") {
          const value = transaction.amount
          if (transaction.transferDirection === "send") {
            updatedUser.budget.cash -= value
          } else {
            updatedUser.budget.cash += value
          }
        }

        // Update total balance
        updatedUser.budget.totalBalance = updatedUser.budget.cash + updatedUser.budget.investments

        // Update user state
        setUser(updatedUser)
      }

      return result
    } catch (err) {
      console.error("Error processing transaction:", err)
      throw err
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        updateUser,
        uploadProfileImage,
        refreshUser,
        processTransaction,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)

