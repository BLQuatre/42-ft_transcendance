"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trophy, User, Users, Monitor } from "lucide-react"
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
import { MultiplayerOptionsDialog } from "./MultiplayerOptionsDialog"

type GameModeDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  gameType: "pong" | "dino"
  gameTitle: string
  dict: any
}

export function GameModeDialog({ open, onOpenChange, gameType, gameTitle, dict }: GameModeDialogProps) {
  const router = useRouter()
  const [selectedMode, setSelectedMode] = useState<string | null>(null)
  const [isMultiplayerDialogOpen, setIsMultiplayerDialogOpen] = useState(false)

  function handleModeSelect(mode: string) {
    setSelectedMode(mode)

    // If multiplayer is selected, open the multiplayer dialog
    if (mode === "multiplayer") {
      setIsMultiplayerDialogOpen(true)
      // Keep the main dialog open for now
    } else {
      // Navigate to the appropriate URL based on game type and mode
      router.push(`/games/${gameType}/${mode}`)
      onOpenChange(false)
    }
  }

  const getColorClass = () => {
    return gameType === "pong" ? "bg-game-blue" : "bg-game-orange"
  }

  const getTextColorClass = () => {
    return gameType === "pong" ? "text-game-blue" : "text-game-orange"
  }

  const getBorderColorClass = () => {
    return gameType === "pong" ? "border-game-blue" : "border-game-orange"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`p-6 ${gameType === "pong" ? "sm:max-w-[1000px]" : "sm:max-w-[600px]"}`}>
        <DialogHeader className="animate-fadeIn mb-4">
          <DialogTitle className="font-pixel text-sm">
            {dict.common.play} {gameTitle.toUpperCase()}
          </DialogTitle>
          <DialogDescription className="font-pixel text-xs">SELECT GAME MODE</DialogDescription>
        </DialogHeader>

        <div
          className={`grid grid-cols-1 ${gameType === "pong" ? "md:grid-cols-4" : "md:grid-cols-2"} gap-4 animate-slideUp`}
        >
          {/* 1v1 Local Mode Card - Only show for Pong */}
          {gameType === "pong" && (
            <div
              className={`rounded-md border-2 ${
                selectedMode === "local"
                  ? `${getBorderColorClass()} ${getColorClass()} text-white`
                  : "border-muted bg-muted/50 hover:bg-muted"
              } p-4 cursor-pointer transition-all`}
              onClick={() => setSelectedMode("local")}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    selectedMode === "local" ? "bg-white/20" : getColorClass()
                  }`}
                >
                  <Monitor className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3
                    className={`font-pixel text-sm mb-2 ${
                      selectedMode === "local" ? "text-white" : getTextColorClass()
                    }`}
                  >
                    1V1 LOCAL
                  </h3>
                  <p
                    className={`font-pixel text-xs ${
                      selectedMode === "local" ? "text-white/80" : "text-muted-foreground"
                    }`}
                  >
                    PLAY WITH A FRIEND LOCALLY
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Solo Mode Card */}
          <div
            className={`rounded-md border-2 ${
              selectedMode === "ai"
                ? `${getBorderColorClass()} ${getColorClass()} text-white`
                : "border-muted bg-muted/50 hover:bg-muted"
            } p-4 cursor-pointer transition-all`}
            onClick={() => setSelectedMode("ai")}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  selectedMode === "ai" ? "bg-white/20" : getColorClass()
                }`}
              >
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3
                  className={`font-pixel text-sm mb-2 ${selectedMode === "ai" ? "text-white" : getTextColorClass()}`}
                >
                  SOLO MODE
                </h3>
                <p
                  className={`font-pixel text-xs ${
                    selectedMode === "ai" ? "text-white/80" : "text-muted-foreground"
                  }`}
                >
                  PLAY AGAINST THE COMPUTER
                </p>
              </div>
            </div>
          </div>

          {/* Multiplayer Mode Card */}
          <div
            className={`rounded-md border-2 ${
              selectedMode === "multiplayer"
                ? `${getBorderColorClass()} ${getColorClass()} text-white`
                : "border-muted bg-muted/50 hover:bg-muted"
            } p-4 cursor-pointer transition-all`}
            onClick={() => setSelectedMode("multiplayer")}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  selectedMode === "multiplayer" ? "bg-white/20" : getColorClass()
                }`}
              >
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3
                  className={`font-pixel text-sm mb-2 ${
                    selectedMode === "multiplayer" ? "text-white" : getTextColorClass()
                  }`}
                >
                  MULTIPLAYER
                </h3>
                <p
                  className={`font-pixel text-xs ${
                    selectedMode === "multiplayer" ? "text-white/80" : "text-muted-foreground"
                  }`}
                >
                  PLAY WITH FRIENDS
                </p>
              </div>
            </div>
          </div>

          {/* Tournament Mode Card - Only show for Pong */}
          {gameType === "pong" && (
            <div
              className={`rounded-md border-2 ${
                selectedMode === "tournament"
                  ? `${getBorderColorClass()} ${getColorClass()} text-white`
                  : "border-muted bg-muted/50 hover:bg-muted"
              } p-4 cursor-pointer transition-all`}
              onClick={() => setSelectedMode("tournament")}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    selectedMode === "tournament" ? "bg-white/20" : getColorClass()
                  }`}
                >
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3
                    className={`font-pixel text-sm mb-2 ${
                      selectedMode === "tournament" ? "text-white" : getTextColorClass()
                    }`}
                  >
                    TOURNAMENT
                  </h3>
                  <p
                    className={`font-pixel text-xs ${
                      selectedMode === "tournament" ? "text-white/80" : "text-muted-foreground"
                    }`}
                  >
                    COMPETE IN A TOURNAMENT
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="pt-6 animate-slideUp">
          <DialogClose asChild>
            <Button variant="outline" className="font-pixel text-xs mr-2">
              {dict.common.cancel || "CANCEL"}
            </Button>
          </DialogClose>
          <Button
            variant="default"
            className={`font-pixel text-xs ${getColorClass()}`}
            disabled={!selectedMode}
            onClick={() => selectedMode && handleModeSelect(selectedMode)}
          >
            {selectedMode ? `PLAY ${selectedMode.toUpperCase()}` : "SELECT A MODE"}
          </Button>
        </DialogFooter>
        {/* Multiplayer Options Dialog */}
        <MultiplayerOptionsDialog
          open={isMultiplayerDialogOpen}
          onOpenChange={setIsMultiplayerDialogOpen}
          gameType={gameType}
          onComplete={() => {
            setIsMultiplayerDialogOpen(false)
            onOpenChange(false)
          }}
          getColorClass={getColorClass}
          getTextColorClass={getTextColorClass}
          getBorderColorClass={getBorderColorClass}
        />
      </DialogContent>
    </Dialog>
  )
}
