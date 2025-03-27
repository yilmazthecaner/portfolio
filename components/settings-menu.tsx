"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  Moon,
  Sun,
  Bell,
  Shield,
  Eye,
  EyeOff,
  Minimize,
  Maximize,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTheme } from "@/components/theme-provider";
import { useSettings } from "@/context/settings-context";
import { useTranslation } from "@/context/translation-context";

interface SettingsMenuProps {
  onClose: () => void;
}

export function SettingsMenu({ onClose }: SettingsMenuProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const { hideBalance, setHideBalance, compactMode, setCompactMode } =
    useSettings();
  const { language, setLanguage, t } = useTranslation();
  const [selectedLang, setSelectedLang] = useState<"tr" | "en">(language);
  const [pendingTheme, setPendingTheme] = useState(theme);

  const handleSave = async () => {
    try {
      setTheme(pendingTheme);
      setLanguage(selectedLang);
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (overlayRef.current === e.target) onClose();
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-lg border-border">
          <CardHeader className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
            <CardTitle>{t("settings")}</CardTitle>
            <CardDescription>{t("customizePortfolio")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="appearance" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="appearance">{t("appearance")}</TabsTrigger>
                <TabsTrigger value="language">{t("language")}</TabsTrigger>
                <TabsTrigger value="notifications">
                  {t("notifications")}
                </TabsTrigger>
                <TabsTrigger value="security">{t("security")}</TabsTrigger>
              </TabsList>

              <TabsContent value="appearance" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">{t("theme")}</h3>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant={
                          pendingTheme === "light" ? "default" : "outline"
                        }
                        className="justify-start"
                        onClick={() => setPendingTheme("light")}
                      >
                        <Sun className="mr-2 h-4 w-4" />
                        {t("light")}
                      </Button>
                      <Button
                        variant={
                          pendingTheme === "dark" ? "default" : "outline"
                        }
                        className="justify-start"
                        onClick={() => setPendingTheme("dark")}
                      >
                        <Moon className="mr-2 h-4 w-4" />
                        {t("dark")}
                      </Button>
                      <Button
                        variant={
                          pendingTheme === "system" ? "default" : "outline"
                        }
                        className="justify-start"
                        onClick={() => setPendingTheme("system")}
                      >
                        <span className="mr-2">💻</span>
                        {t("system")}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        {compactMode ? (
                          <Minimize className="h-4 w-4" />
                        ) : (
                          <Maximize className="h-4 w-4" />
                        )}
                        <Label htmlFor="compact-view">{t("compactView")}</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {t("reduceSpacing")}
                      </p>
                    </div>
                    <Switch
                      id="compact-view"
                      checked={compactMode}
                      onCheckedChange={setCompactMode}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="language" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">{t("selectLanguage")}</h3>
                    <RadioGroup
                      defaultValue={language}
                      onValueChange={(value) => {
                        localStorage.setItem("preferredLanguage", value);
                        setSelectedLang(value as "tr" | "en");
                      }}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="tr" id="tr" />
                        <Label htmlFor="tr" className="flex items-center">
                          <span className="mr-2">TR</span>
                          Türkçe
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="en" id="en" />
                        <Label htmlFor="en" className="flex items-center">
                          <span className="mr-2">EN</span>
                          English
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        <Label htmlFor="price-alerts">{t("priceAlerts")}</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {t("priceAlertsDesc")}
                      </p>
                    </div>
                    <Switch id="price-alerts" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        <Label htmlFor="transaction-alerts">
                          {t("transactionAlerts")}
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {t("transactionAlertsDesc")}
                      </p>
                    </div>
                    <Switch id="transaction-alerts" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        <Label htmlFor="news-alerts">{t("newsAlerts")}</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {t("newsAlertsDesc")}
                      </p>
                    </div>
                    <Switch id="news-alerts" />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="security" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        <Label htmlFor="two-factor">{t("twoFactor")}</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {t("twoFactorDesc")}
                      </p>
                    </div>
                    <Switch id="two-factor" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        {hideBalance ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <Label htmlFor="hide-balance">{t("hideBalance")}</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {t("hideBalanceDesc")}
                      </p>
                    </div>
                    <Switch
                      id="hide-balance"
                      checked={hideBalance}
                      onCheckedChange={setHideBalance}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={onClose}>
              {t("cancel")}
            </Button>
            <Button onClick={handleSave}>{t("saveChanges")}</Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
