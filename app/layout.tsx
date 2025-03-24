import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { SettingsProvider } from "@/context/settings-context"
import { TranslationProvider } from "@/context/translation-context"
import { UserProvider } from "@/context/user-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="system">
          <SettingsProvider>
            <TranslationProvider>
              <UserProvider>
                {children}
                <Toaster />
              </UserProvider>
            </TranslationProvider>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

