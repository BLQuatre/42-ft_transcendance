"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/Card"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Skin } from "@/types/skins"

interface SkinSelectorProps {
  title: string
  description: string
  skins: Skin[]
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
            selectedSkin === skin.id ? "border-2 border-game-blue" : ""
          )}
          onClick={() => handleSelect(skin.id)}
        >
          <CardContent className="p-3 text-center relative">
            <div className="relative w-full h-24 mb-2 bg-muted rounded-md overflow-hidden">
              <Image src={skin.image || "/placeholder.svg"} alt={skin.name} fill className="object-cover" />
            </div>
            <p className="font-pixel text-xs truncate">{skin.name}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
