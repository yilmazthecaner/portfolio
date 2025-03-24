"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { translations } from "@/lib/translations"

type Language = "tr" | "en"

interface TranslationContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const TranslationContext = createContext<TranslationContextType>({
  language: "tr",
  setLanguage: () => {},
  t: (key) => key,
})

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("tr")

  // Load language preference from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "tr" || savedLanguage === "en")) {
      setLanguageState(savedLanguage)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string): string => {
    return translations[language][key] || translations.en[key] || key
  }

  return <TranslationContext.Provider value={{ language, setLanguage, t }}>{children}</TranslationContext.Provider>
}

export const useTranslation = () => useContext(TranslationContext)

