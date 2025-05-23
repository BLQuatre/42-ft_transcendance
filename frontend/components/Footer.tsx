"use client"

import { useDictionary } from "@/hooks/UseDictionnary"
import Link from "next/link"
import { Languages } from "lucide-react"
import { useState } from "react"
import { LanguageSelectorDialog } from "@/components/dialog/LanguageSelectorDialog"
import { cn } from "@/lib/utils"

export function Footer() {
  const dict = useDictionary()
  const [languageDialogOpen, setLanguageDialogOpen] = useState(false)

  if (!dict) return null

  return (
    <footer className="border-t border-muted py-6">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <div
              onClick={() => setLanguageDialogOpen(true)}
              className={cn(
                "flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-muted cursor-pointer",
                languageDialogOpen ? "bg-muted" : "",
              )}
            >
              <Languages className="h-5 w-5" />
              <span className="font-pixel text-xs uppercase">{dict.navbar.language || "Language"}</span>
            </div>
          </div>
          <p className="font-pixel text-xs bg-linear-to-r from-game-blue via-game-orange to-game-red bg-clip-text text-transparent animate-pixelate uppercase">
            © 2025 {dict.title}
          </p>
          <div className="flex items-center space-x-4">
            <Link href="/terms" className="font-pixel text-xs text-muted-foreground hover:text-game-blue uppercase">
              {dict.footer.terms}
            </Link>
            <Link href="/privacy" className="font-pixel text-xs text-muted-foreground hover:text-game-blue uppercase">
              {dict.footer.privacy}
            </Link>
          </div>
        </div>
      </div>

      <LanguageSelectorDialog open={languageDialogOpen} onOpenChange={setLanguageDialogOpen} />
    </footer>
  )
}
