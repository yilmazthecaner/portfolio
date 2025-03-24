"use client"

import { useEffect, useState } from "react"
import { LogOut, Settings, UserIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ProfileMenu } from "@/components/profile-menu"
import { SettingsMenu } from "@/components/settings-menu"
import { useUser } from "@/context/user-context"
import { useTranslation } from "@/context/translation-context"

export function UserNav() {
  const { user, loading } = useUser()
  const { t } = useTranslation()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showSettingsMenu, setShowSettingsMenu] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <Avatar className="h-8 w-8">
        <AvatarFallback>...</AvatarFallback>
      </Avatar>
    )
  }

  if (loading) {
    return (
      <Avatar className="h-8 w-8">
        <AvatarFallback>...</AvatarFallback>
      </Avatar>
    )
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.imageUrl} alt={user?.name || ""} />
              <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.name}</p>
              <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setShowProfileMenu(true)}>
              <UserIcon className="mr-2 h-4 w-4" />
              <span>{t("profile")}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowSettingsMenu(true)}>
              <Settings className="mr-2 h-4 w-4" />
              <span>{t("settings")}</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            <span>{t("logout")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {showProfileMenu && <ProfileMenu onClose={() => setShowProfileMenu(false)} />}

      {showSettingsMenu && <SettingsMenu onClose={() => setShowSettingsMenu(false)} />}
    </>
  )
}

