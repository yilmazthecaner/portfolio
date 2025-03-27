"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useTranslation } from "@/context/translation-context"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()
  const { t } = useTranslation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const routes = [
    {
      href: "/",
      label: t("dashboard"),
      active: pathname === "/",
    },
    // {
    //   href: "/portfolio",
    //   label: t("portfolio"),
    //   active: pathname === "/portfolio",
    // },
    {
      href: "/transactions",
      label: t("transactions"),
      active: pathname === "/transactions",
    },
    {
      href: "/markets",
      label: t("markets"),
      active: pathname === "/markets",
    },
  ]

  if (!isMounted) {
    return null
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={cn("hidden md:flex items-center space-x-4 lg:space-x-6", className)} {...props}>
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary relative py-2",
              route.active ? "text-primary" : "text-muted-foreground",
            )}
          >
            {route.label}
            {route.active && (
              <motion.div
                className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-primary"
                layoutId="activeTab"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </Link>
        ))}
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] sm:w-[300px]">
            <div className="flex flex-col space-y-4 py-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">{t("menu")}</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center py-2 px-3 text-sm font-medium rounded-md transition-colors",
                    route.active ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted",
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {route.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}

