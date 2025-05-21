"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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

type MultiplayerOptionsDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  gameType: "pong" | "dino"
  onComplete: () => void
  getColorClass: () => string
  getTextColorClass: () => string
  getBorderColorClass: () => string
}

export function MultiplayerOptionsDialog({
  open,
  onOpenChange,
  gameType,
  onComplete,
  getColorClass,
  getTextColorClass,
  getBorderColorClass,
}: MultiplayerOptionsDialogProps) {
  const router = useRouter()
  const [roomCode, setRoomCode] = useState("")
  const [selectedOption, setSelectedOption] = useState<"create" | "join" | null>(null)
  const [playerCount, setPlayerCount] = useState<2 | 4 | 6 | 8>(2)
  const [isNavigating, setIsNavigating] = useState(false)

  const handleMultiplayerOption = async (option: "create" | "join") => {
    if (isNavigating) return; // Prevent multiple calls
    
    setIsNavigating(true);
    
    try {
      if (option === "create") {
        // Generate a random room code
        const newRoomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        
        // Make sure the connection is ready before navigating
        // First close the dialog to avoid UI glitches
        onOpenChange(false);
        
        // Wait a short delay before navigation to ensure dialog closes smoothly
        setTimeout(() => {
			window.location.assign(`/games/${gameType}/multi/${newRoomCode}`)
        }, 100);
        
      } else if (option === "join" && roomCode.trim()) {
        // First close the dialog
        onOpenChange(false);
        
        // Wait a short delay before navigation
        setTimeout(() => {
			window.location.assign(`/games/${gameType}/multi/${roomCode.trim()}`)
        }, 100);
      }
    } catch (error) {
      console.error("Navigation error:", error);
      setIsNavigating(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      // Don't allow closing the dialog while navigating
      if (isNavigating && !isOpen) return;
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-[500px] p-6">
        <DialogHeader className="animate-fadeIn mb-4">
          <DialogTitle className="font-pixel text-sm">MULTIPLAYER OPTIONS</DialogTitle>
          <DialogDescription className="font-pixel text-xs">CREATE A NEW ROOM OR JOIN WITH A CODE</DialogDescription>
        </DialogHeader>

        <div className="animate-slideUp">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Button
              variant="outline"
              className={`font-pixel text-xs border-2 ${
                selectedOption === "create"
                  ? `${getBorderColorClass()} ${getColorClass()} text-white`
                  : `${getBorderColorClass()} hover:${getColorClass()} hover:text-white`
              } p-6 h-auto`}
              onClick={() => {
                setSelectedOption("create")
              }}
              disabled={isNavigating}
            >
              CREATE A ROOM
            </Button>

            <Button
              variant="outline"
              className={`font-pixel text-xs border-2 ${
                selectedOption === "join"
                  ? `${getBorderColorClass()} ${getColorClass()} text-white`
                  : `${getBorderColorClass()} hover:${getColorClass()} hover:text-white`
              } p-6 h-auto`}
              onClick={() => {
                setSelectedOption("join")
              }}
              disabled={isNavigating}
            >
              JOIN WITH CODE
            </Button>
          </div>

          {selectedOption === "create" && (
            <div className="mt-4 animate-fadeIn">
              <label className="font-pixel text-xs block mb-2">SELECT PLAYERS:</label>
              <div className="grid grid-cols-4 gap-2">
                {[2, 4, 6, 8].map((count) => (
                  <Button
                    key={count}
                    variant="outline"
                    className={`font-pixel text-xs border-2 ${
                      playerCount === count
                        ? `${getBorderColorClass()} ${getColorClass()} text-white`
                        : `${getBorderColorClass()} hover:${getColorClass()} hover:text-white`
                    } p-2 h-auto`}
                    onClick={() => setPlayerCount(count as 2 | 4 | 6 | 8)}
                    disabled={isNavigating}
                  >
                    {count}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {selectedOption === "join" && (
            <div className="mt-4 animate-fadeIn">
              <label className="font-pixel text-xs block mb-2">ROOM CODE:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="ENTER ROOM CODE"
                  className="font-pixel text-xs p-2 border-2 border-muted rounded-md w-full bg-background"
                  maxLength={6}
                  autoFocus
                  disabled={isNavigating}
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="pt-6 animate-slideUp">
          <DialogClose asChild>
            <Button 
              variant="outline" 
              className="font-pixel text-xs mr-2"
              disabled={isNavigating}
            >
              CANCEL
            </Button>
          </DialogClose>
          <Button
            variant="default"
            className={`font-pixel text-xs ${getColorClass()}`}
            disabled={!selectedOption || (selectedOption === "join" && !roomCode.trim()) || isNavigating}
            onClick={() => selectedOption && handleMultiplayerOption(selectedOption)}
          >
            {isNavigating 
              ? "CONNECTING..." 
              : selectedOption === "create" 
                ? "CREATE ROOM" 
                : selectedOption === "join" 
                  ? "JOIN ROOM" 
                  : "SELECT AN OPTION"
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}