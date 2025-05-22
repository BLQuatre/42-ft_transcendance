"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { ArrowRight } from "lucide-react"
import { GameModeDialog } from "@/components/dialog/GameModeDialog"
import { GameType } from "@/types/game"
import { cn } from "@/lib/utils"
import { getBgColor } from "@/lib/colors"

type GameButtonsProps = {
  gameType: GameType
  buttonText: string
}

export function GameButtons({ gameType, buttonText }: GameButtonsProps) {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <Button
        className={cn(
          "font-pixel w-fit mt-2 cursor-pointer",
          getBgColor(gameType),
          `hover:${getBgColor(gameType)}/90`
        )}
        onClick={() => setDialogOpen(true)}
      >
        <span className="flex items-center uppercase">
          {buttonText}
          <ArrowRight className="ml-2 h-4 w-4" />
        </span>
      </Button>

      <GameModeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        gameType={gameType}
      />
    </>
  )
}
