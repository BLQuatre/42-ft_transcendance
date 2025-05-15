"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { GameModeDialog } from "@/components/game-mode-dialog"

type GameButtonsProps = {
  gameType: "pong" | "dino"
  gameTitle: string
  buttonText: string
  buttonColor: "blue" | "orange"
  dict: any
}

export function GameButtons({ gameType, gameTitle, buttonText, buttonColor, dict }: GameButtonsProps) {
  const [dialogOpen, setDialogOpen] = useState(false)

  const getButtonClass = () => {
    return buttonColor === "blue" ? "bg-game-blue hover:bg-game-blue/90" : "bg-game-orange hover:bg-game-orange/90"
  }

  return (
    <>
      <Button className={`font-pixel ${getButtonClass()} w-fit mt-2`} onClick={() => setDialogOpen(true)}>
        <span className="flex items-center uppercase">
          {buttonText}
          <ArrowRight className="ml-2 h-4 w-4" />
        </span>
      </Button>

      <GameModeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        gameType={gameType}
        gameTitle={gameTitle}
        dict={dict}
      />
    </>
  )
}
