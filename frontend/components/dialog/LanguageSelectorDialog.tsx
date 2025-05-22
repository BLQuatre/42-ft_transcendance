"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/Dialog"
import { Button } from "@/components/ui/Button"
import { setCookie } from "cookies-next"

const languages: { code: string; name: string; flag: string }[] = [
  {
    code: "en",
    name: "English",
    flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/2560px-Flag_of_the_United_Kingdom_%283-5%29.svg.png",
  },
  {
    code: "fr",
    name: "Français",
    flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Flag_of_France.svg/2560px-Flag_of_France.svg.png",
  },
  { code: "ru", name: "Русский", flag: "https://upload.wikimedia.org/wikipedia/en/f/f3/Flag_of_Russia.svg" },
  {
    code: "ro",
    name: "Română",
    flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Flag_of_Moldova.svg/1280px-Flag_of_Moldova.svg.png",
  },
]

interface LanguageSelectorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LanguageSelectorDialog({ open, onOpenChange }: LanguageSelectorDialogProps) {
  const router = useRouter()


  const selectLanguage = (lang: string) => {
    setCookie("selectedLanguage", lang, {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
      sameSite: "lax",
    })

    onOpenChange(false)
    let path = window.location.pathname.slice(3)
    if (path.startsWith("/"))
      path = path.slice(1)
    window.location.href = `/${lang}/${path}`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card pixel-border">
        <DialogHeader>
          <DialogTitle className="font-pixel text-2xl text-center uppercase">Select Your Language</DialogTitle>
        </DialogHeader>
        <DialogDescription className="font-pixel text-sm text-center">
          This will be used for all text on the site
        </DialogDescription>
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
      </DialogContent>
    </Dialog>
  )
}
