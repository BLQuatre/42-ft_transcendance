"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { ArrowRight } from "lucide-react"
import { GameModeDialog } from "@/components/dialog/GameModeDialog"
import { GameType } from "@/types/game"
import { cn } from "@/lib/utils"
import { getBgColor, getHoverBgColor } from "@/lib/colors"
import { useAuth } from "@/contexts/auth-context"

type GameButtonsProps = {
  gameType: GameType
  buttonText: string
}

export function GameButtons({ gameType, buttonText }: GameButtonsProps) {
  const { accessToken } = useAuth()

  const [dialogOpen, setDialogOpen] = useState(false)

  const disabled = accessToken === null && gameType === GameType.DINO

  return (
    <>
      <Button
        asChild
        className={cn(
          "font-pixel w-fit mt-2",
          (disabled)
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer",
          getBgColor(gameType),
          getHoverBgColor(gameType)
        )}
        onClick={() => {
          if (!disabled)
            setDialogOpen(true)
        } }
        disabled={disabled}
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
