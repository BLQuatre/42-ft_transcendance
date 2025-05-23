"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/Dialog"
import { Button } from "@/components/ui/Button"
import { GameType } from "@/types/game"
import { getBgColor, getBorderColor } from "@/lib/colors"
import { cn } from "@/lib/utils"
import { Game } from "@/lib/pong/game"

type MultiplayerOptionsDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  gameType: GameType
}

enum MultiplayerOption {
  CREATE = "create",
  JOIN = "join",
  MATCHMAKING = "matchmaking",
}

export function MultiplayerOptionsDialog({
  open,
  onOpenChange,
  gameType
}: MultiplayerOptionsDialogProps) {
  const [roomCode, setRoomCode] = useState("")
  const [selectedOption, setSelectedOption] = useState<MultiplayerOption | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleMultiplayerOption = async (option: MultiplayerOption) => {
    if (isLoading) return

    setIsLoading(true)

    try {
      if (option === MultiplayerOption.CREATE) {
        const newRoomCode = Math.random().toString(36).substring(2, 8).toUpperCase()

        window.location.assign(`/games/${gameType}/multi/${newRoomCode}`)
      } else if (option === MultiplayerOption.JOIN && roomCode.trim()) {
        window.location.assign(`/games/${gameType}/multi/${roomCode.trim()}`)
      } else if (option === MultiplayerOption.MATCHMAKING) {
        window.location.assign(`/games/${gameType}/multi/matchmaking`)
      }
    } catch (error) {
      console.error("Navigation error:", error)
      setIsLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        // Don't allow closing the dialog while Loading
        if (isLoading && !isOpen) return
        onOpenChange(isOpen)
      }}
    >
      <DialogContent className="sm:max-w-[700px] p-6">
        <DialogHeader className="animate-fadeIn mb-4">
          <DialogTitle className="font-pixel text-sm">MULTIPLAYER OPTIONS</DialogTitle>
          <DialogDescription className="font-pixel text-xs">CREATE A NEW ROOM OR JOIN WITH A CODE</DialogDescription>
        </DialogHeader>

        <div className="animate-slideUp">
          <div className={cn(
            "grid grid-cols-1 gap-4 mb-6",
            gameType === GameType.PONG ? "md:grid-cols-3" : "md:grid-cols-2"
          )}>
            <Button
              variant="custom"
              className={cn(
                "font-pixel text-xs border-2 p-6 h-auto text-white",
                getBorderColor(gameType),
                selectedOption === MultiplayerOption.CREATE
                  ? getBgColor(gameType)
                  : "hover:bg-muted"
              )}
              onClick={() => setSelectedOption(MultiplayerOption.CREATE)}
              disabled={isLoading}
            >
              CREATE A ROOM
            </Button>

            <Button
              variant="custom"
              className={cn(
                "font-pixel text-xs border-2 p-6 h-auto text-white",
                getBorderColor(gameType),
                selectedOption === MultiplayerOption.JOIN
                  ? getBgColor(gameType)
                  : "hover:bg-muted"
              )}
              onClick={() => setSelectedOption(MultiplayerOption.JOIN)}
              disabled={isLoading}
            >
              JOIN WITH CODE
            </Button>

            <Button
              variant="custom"
              className={cn(
                "font-pixel text-xs border-2 p-6 h-auto text-white",
                getBorderColor(gameType),
                selectedOption === MultiplayerOption.MATCHMAKING
                  ? getBgColor(gameType)
                  : "hover:bg-muted"
              )}
              onClick={() => setSelectedOption(MultiplayerOption.MATCHMAKING)}
              disabled={isLoading}
            >
              MATCHMAKING
            </Button>
          </div>

          {selectedOption === "join" && (
            <div className="mt-4 animate-fadeIn">
              <label className="font-pixel text-xs block mb-2">ROOM CODE:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="ENTER ROOM CODE"
                  className={cn(
                    "font-pixel text-xs p-2 border-2 border-muted rounded-md w-full bg-background focus:outline-none focus:ring-2",
                    gameType === GameType.PONG
                      ? "focus:border-game-blue focus:ring-primary/20"
                      : "focus:border-game-orange focus:ring-secondary/20"
                  )}
                  minLength={6}
                  maxLength={6}
                  autoFocus
                  disabled={isLoading}
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="pt-6 animate-slideUp">
          <DialogClose asChild>
            <Button variant="cancel" className="font-pixel text-xs mr-2" disabled={isLoading}>
              CANCEL
            </Button>
          </DialogClose>
          <Button
            variant="default"
            className={cn("font-pixel text-xs", getBgColor(gameType))}
            disabled={!selectedOption || (selectedOption === MultiplayerOption.JOIN && (!roomCode.trim() || roomCode.length !== 6)) || isLoading}
            onClick={() => selectedOption && handleMultiplayerOption(selectedOption)}
          >
            {isLoading
              ? "CONNECTING..."
              : selectedOption === MultiplayerOption.CREATE
                ? "CREATE ROOM"
                : selectedOption === MultiplayerOption.JOIN
                  ? "JOIN ROOM"
                  : selectedOption === MultiplayerOption.MATCHMAKING
                    ? "JOIN MATCHMAKING"
                    : "SELECT AN OPTION"
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
