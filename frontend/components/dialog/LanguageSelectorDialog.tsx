"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog"
import { Button } from "@/components/ui/Button"

const languages: { code: string; name: string; flag: string }[] = [
  { code: "en", name: "English", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/2560px-Flag_of_the_United_Kingdom_%283-5%29.svg.png" },
  { code: "fr", name: "Français", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Flag_of_France.svg/2560px-Flag_of_France.svg.png" },
  { code: "ru", name: "Русский", flag: "https://upload.wikimedia.org/wikipedia/en/f/f3/Flag_of_Russia.svg" },
  { code: "ro", name: "Română", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Flag_of_Moldova.svg/1280px-Flag_of_Moldova.svg.png" },
]

export function LanguageSelectorDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // const hasSelectedLanguage = getCookie("selectedLanguage")

    // if (!hasSelectedLanguage) {
      // setIsOpen(true)
    // }
  }, [])

  const selectLanguage = (lang: string) => {
    // Set cookie with 1 year expiration
    // setCookie("selectedLanguage", lang, {
    //   maxAge: 60 * 60 * 24 * 365, // 1 year in seconds
    //   path: "/",
    //   sameSite: "lax"
    // })

    setIsOpen(false)
    router.push(`/${lang}`)
  }

  // Prevent dialog from closing when user tries to dismiss it
  const handleOpenChange = (open: boolean) => {
    // Only allow closing if it's being opened (which shouldn't happen)
    // or if we're explicitly closing it after language selection
    if (open) {
      setIsOpen(open)
    }
    // Ignore attempts to close the dialog
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-md bg-card pixel-border"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        hideCloseButton={true}
      >
        <DialogHeader>
          <DialogTitle className="font-pixel text-2xl text-center uppercase">Select Your Language</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          {languages.map((language) => (
            <Button
              key={language.code}
              variant="outline"
              className="flex flex-col items-center p-6 h-auto font-pixel hover:bg-muted border-2 hover:border-game-blue"
              onClick={() => selectLanguage(language.code)}
            >
              <div className="w-16 h-12 relative mb-2 pixel-border overflow-hidden">
                <Image src={language.flag || "/placeholder.svg"} alt={language.name} fill className="object-cover" />
              </div>
              <span className="mt-2 uppercase">{language.name}</span>
            </Button>
          ))}
        </div>
        <div className="text-center text-sm text-muted-foreground font-pixel mt-2">
          Please select a language to continue
        </div>
      </DialogContent>
    </Dialog>
  )
}
