"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

interface SettingsContextType {
  hideBalance: boolean
  setHideBalance: (value: boolean) => void
  compactMode: boolean
  setCompactMode: (value: boolean) => void
}

const SettingsContext = createContext<SettingsContextType>({
  hideBalance: false,
  setHideBalance: () => {},
  compactMode: false,
  setCompactMode: () => {},
})

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [hideBalance, setHideBalance] = useState(false)
  const [compactMode, setCompactMode] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedHideBalance = localStorage.getItem("hideBalance")
      if (savedHideBalance) {
        setHideBalance(savedHideBalance === "true")
      }

      const savedCompactMode = localStorage.getItem("compactMode")
      if (savedCompactMode) {
        setCompactMode(savedCompactMode === "true")
      }
    }
  }, [])

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem("hideBalance", hideBalance.toString())
  }, [hideBalance])

  useEffect(() => {
    localStorage.setItem("compactMode", compactMode.toString())

    // Apply compact mode to the document body
    if (compactMode) {
      document.body.classList.add("compact-mode")
    } else {
      document.body.classList.remove("compact-mode")
    }
  }, [compactMode])

  return (
    <SettingsContext.Provider
      value={{
        hideBalance,
        setHideBalance,
        compactMode,
        setCompactMode,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)

