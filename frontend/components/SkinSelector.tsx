"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/Card"
import Image from "next/image"
import { cn } from "@/lib/Utils"
import { Check } from "lucide-react"

interface SkinSelectorProps {
  title: string
  description: string
  skins: {
    id: string
    name: string
    image: string
    owned?: boolean
  }[]
  defaultSelected?: string
  onSelect?: (id: string) => void
}

export function SkinSelector({ skins, defaultSelected, onSelect }: SkinSelectorProps) {
  const [selectedSkin, setSelectedSkin] = useState(defaultSelected || skins[0]?.id)

  const handleSelect = (id: string) => {
    setSelectedSkin(id)
    if (onSelect) {
      onSelect(id)
    }
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {skins.map((skin) => (
        <Card
          key={skin.id}
          className={cn(
            "cursor-pointer transition-all hover:scale-105",
            selectedSkin === skin.id ? "border-2 border-game-blue" : "",
            !skin.owned ? "opacity-60" : "",
          )}
          onClick={() => skin.owned && handleSelect(skin.id)}
        >
          <CardContent className="p-3 text-center relative">
            {selectedSkin === skin.id && (
              <div className="absolute top-1 right-1 bg-game-blue rounded-full p-0.5">
                <Check className="h-3 w-3 text-white" />
              </div>
            )}
            <div className="relative w-full h-24 mb-2 bg-muted rounded-md overflow-hidden">
              <Image src={skin.image || "/placeholder.svg"} alt={skin.name} fill className="object-cover" />
            </div>
            <p className="font-pixel text-xs truncate">{skin.name}</p>
            {!skin.owned && <p className="font-pixel text-[10px] text-muted-foreground">LOCKED</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
