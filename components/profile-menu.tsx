"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { X, Camera, Edit2, Save, Loader2 } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useUser } from "@/context/user-context"
import { useTranslation } from "@/context/translation-context"
import { toast } from "@/components/ui/use-toast"

interface ProfileMenuProps {
  onClose: () => void
}

export function ProfileMenu({ onClose }: ProfileMenuProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user, updateUser, uploadProfileImage } = useUser()
  const { t } = useTranslation()

  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
    }
  }, [user])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (overlayRef.current === e.target) onClose()
    }

    document.addEventListener("keydown", handleEscape)
    document.addEventListener("mousedown", handleClickOutside)

    // Lock body scroll
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "auto"
    }
  }, [onClose])

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview the image
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload the image
    try {
      setIsUploading(true)
      await uploadProfileImage(file)
      toast({
        title: t("profileImageUpdated"),
        description: t("profileImageUpdatedDesc"),
      })
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: t("profileImageUpdateFailed"),
        description: t("profileImageUpdateFailedDesc"),
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      await updateUser({ name, email })
      toast({
        title: t("profileUpdated"),
        description: t("profileUpdatedDesc"),
      })
      onClose()
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: t("profileUpdateFailed"),
        description: t("profileUpdateFailedDesc"),
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div ref={overlayRef} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="relative">
            <Button variant="ghost" size="icon" className="absolute right-2 top-2" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
            <CardTitle>{t("profile")}</CardTitle>
            <CardDescription>{t("managePersonalInfo")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-3">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  {imagePreview ? (
                    <AvatarImage src={imagePreview} alt={name} />
                  ) : (
                    <AvatarImage src={user?.imageUrl} alt={name} />
                  )}
                  <AvatarFallback className="text-2xl">{name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                  onClick={handleImageClick}
                  disabled={isUploading}
                >
                  {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              <div className="text-center">
                <h3 className="font-medium">{name}</h3>
                <p className="text-sm text-muted-foreground">{email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("fullName")}</Label>
                <div className="relative">
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2"
                    tabIndex={-1}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t("email")}</Label>
                <div className="relative">
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2"
                    tabIndex={-1}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={onClose}>
              {t("cancel")}
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("saving")}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {t("saveChanges")}
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

