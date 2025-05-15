"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog"

type Player = {
  id: string
  name: string
  score: number
  isUser: boolean
}

type PongMatchDetails = {
  id: string
  type: string
  result: string
  date: string
  players: Player[]
}

type DinoRunDetails = {
  id: string
  type: string
  result: string
  date: string
  players: Player[]
}

type MatchDetailsDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  match: {
    type: "pong" | "dino"
    details: PongMatchDetails | DinoRunDetails
  } | null
}

export function MatchDetailsDialog({ open, onOpenChange, match }: MatchDetailsDialogProps) {
  if (!match) return null

  const isPong = match.type === "pong"
  const isDino = match.type === "dino"
  const pongMatch = isPong ? (match.details as PongMatchDetails) : null
  const dinoRun = isDino ? (match.details as DinoRunDetails) : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader className="animate-fadeIn">
          <DialogTitle className="font-pixel text-sm">{isPong ? `MATCH DETAILS` : `RUN DETAILS`}</DialogTitle>
          <DialogDescription className="font-pixel text-xs">
            {isPong ? `${pongMatch?.date} • ${pongMatch?.result}` : `${dinoRun?.date} • ${dinoRun?.result}`}
          </DialogDescription>
        </DialogHeader>

        {isPong && pongMatch && (
          <div className="space-y-4 animate-slideUp">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"></div>
            </div>

            <div className="space-y-2">
              <h3 className="font-pixel text-xs text-muted-foreground">PLAYER SCORES</h3>
              <div className="grid grid-cols-1 gap-2">
                {[...pongMatch.players]
                  .sort((a, b) => b.score - a.score)
                  .map((player) => (
                    <div
                      key={player.id}
                      className={`flex justify-between items-center p-2 ${
                        player.isUser ? "bg-primary/10" : "bg-muted/50"
                      } rounded-md`}
                    >
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-pixel text-xs">{player.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-pixel text-xs text-muted-foreground">SCORE</p>
                          <p className={`font-pixel text-xs font-bold ${player.isUser ? "text-game-blue" : ""}`}>
                            {player.score}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button variant="outline" className="font-pixel text-xs mr-2">
                  CLOSE
                </Button>
              </DialogClose>
            </DialogFooter>
          </div>
        )}

        {isDino && dinoRun && (
          <div className="space-y-4 animate-slideUp">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"></div>
            </div>

            <div className="space-y-2">
              <h3 className="font-pixel text-xs text-muted-foreground">PLAYER SCORES</h3>
              <div className="grid grid-cols-1 gap-2">
                {[...dinoRun.players]
                  .sort((a, b) => b.score - a.score)
                  .map((player) => (
                    <div
                      key={player.id}
                      className={`flex justify-between items-center p-2 ${
                        player.isUser ? "bg-primary/10" : "bg-muted/50"
                      } rounded-md`}
                    >
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-pixel text-xs">{player.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-pixel text-xs text-muted-foreground">SCORE</p>
                          <p className={`font-pixel text-xs font-bold ${player.isUser ? "text-game-blue" : ""}`}>
                            {player.score}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button variant="outline" className="font-pixel text-xs mr-2">
                  CLOSE
                </Button>
              </DialogClose>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
