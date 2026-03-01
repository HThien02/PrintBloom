"use client"

import { useLanguage } from "@/lib/language-context"
import { cn } from "@/lib/utils"
import { Globe } from "lucide-react"

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage()

  return (
    <div className="flex items-center gap-1 rounded-full border border-border bg-muted/50 p-0.5">
      <Globe className="ml-1.5 h-3.5 w-3.5 text-muted-foreground" />
      <button
        onClick={() => setLocale("en")}
        className={cn(
          "rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-200",
          locale === "en"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        onClick={() => setLocale("vi")}
        className={cn(
          "rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-200",
          locale === "vi"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
        aria-label="Switch to Vietnamese"
      >
        VI
      </button>
    </div>
  )
}
