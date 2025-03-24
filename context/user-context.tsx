"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User, UserUpdateData } from "@/types/user"
import { userApi } from "@/lib/api"
import type { Transaction, TransactionFormData } from "@/types/transaction"

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

  const fetchUser = async () => {
    try {
      setLoading(true)
      const userData = await userApi.getCurrentUser()
      setUser(userData)
      setError(null)
    } catch (err) {
      console.error("Error fetching user:", err)
      setError(err instanceof Error ? err.message : "Failed to load user data")
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
      throw err
    }
  }

  const refreshUser = async (): Promise<void> => {
    await fetchUser()
  }

  const processTransaction = async (transaction: TransactionFormData): Promise<Transaction> => {
    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transaction),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const result = await response.json()

      await refreshUser()

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

