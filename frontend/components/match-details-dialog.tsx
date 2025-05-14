"use client"

import { Badge } from "@/components/ui/badge"
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

type PlayerStats = {
  aces: number
  errors: number
  powerHits: number
}

type Player = {
  id: string
  name: string
  team: string | null
  score: number
  isUser: boolean
  rank?: number
}

type PongMatchDetails = {
  id: string
  type: string
  result: string
  date: string
  players: Player[]
  teamScores: Record<string, number> | null
  details: {
    duration: string
    map: string
    powerUps: number
    accuracyRate: string
    rallies: number
    longestRally: string
    playerStats: Record<string, PlayerStats>
  }
}

type DinoRunDetails = {
  id: string
  map: string
  score: number
  date: string
  details: {
    duration: string
    obstacles: number
    powerUps: number
    distance: string
    jumps: number
    ducks: number
    coins: number
    achievements: string[]
  }
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
      <DialogContent className="sm:max-w-[600px] border-2 border-game-blue">
        <DialogHeader className="animate-fadeIn">
          <DialogTitle className="font-pixel text-sm">{isPong ? `MATCH DETAILS` : `RUN DETAILS`}</DialogTitle>
          <DialogDescription className="font-pixel text-xs">
            {isPong ? `${pongMatch?.date} • ${pongMatch?.result}` : `${dinoRun?.map} • ${dinoRun?.score} POINTS`}
          </DialogDescription>
        </DialogHeader>

        {isPong && pongMatch && (
          <div className="space-y-4 animate-slideUp">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-pixel text-xs text-muted-foreground">MATCH INFO</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p className="font-pixel text-xs">DURATION:</p>
                  <p className="font-pixel text-xs">{pongMatch.details.duration}</p>
                  <p className="font-pixel text-xs">MAP:</p>
                  <p className="font-pixel text-xs">{pongMatch.details.map}</p>
                  <p className="font-pixel text-xs">POWER-UPS:</p>
                  <p className="font-pixel text-xs">{pongMatch.details.powerUps}</p>
                  <p className="font-pixel text-xs">ACCURACY:</p>
                  <p className="font-pixel text-xs">{pongMatch.details.accuracyRate}</p>
                  <p className="font-pixel text-xs">RALLIES:</p>
                  <p className="font-pixel text-xs">{pongMatch.details.rallies}</p>
                  <p className="font-pixel text-xs">LONGEST RALLY:</p>
                  <p className="font-pixel text-xs">{pongMatch.details.longestRally}</p>
                </div>
              </div>

              {pongMatch.teamScores && (
                <div className="space-y-2">
                  <h3 className="font-pixel text-xs text-muted-foreground">TEAM SCORES</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(pongMatch.teamScores).map(([team, score]) => (
                      <div
                        key={team}
                        className="col-span-2 flex justify-between items-center p-2 bg-muted/50 rounded-md"
                      >
                        <p className="font-pixel text-xs">TEAM {team}</p>
                        <p className="font-pixel text-xs font-bold">{score}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="font-pixel text-xs text-muted-foreground">PLAYER SCORES</h3>
              <div className="grid grid-cols-1 gap-2">
                {pongMatch.players.map((player) => (
                  <div
                    key={player.id}
                    className={`flex justify-between items-center p-2 ${
                      player.isUser ? "bg-primary/10" : "bg-muted/50"
                    } rounded-md`}
                  >
                    <div className="flex items-center space-x-2">
                      {player.isUser && <div className="w-2 h-2 rounded-full bg-game-blue"></div>}
                      <div>
                        <p className="font-pixel text-xs">{player.name}</p>
                        {player.team && <p className="font-pixel text-xs text-muted-foreground">TEAM {player.team}</p>}
                        {player.rank && <p className="font-pixel text-xs text-muted-foreground">RANK #{player.rank}</p>}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-pixel text-xs text-muted-foreground">SCORE</p>
                        <p className={`font-pixel text-xs font-bold ${player.isUser ? "text-game-blue" : ""}`}>
                          {player.score}
                        </p>
                      </div>
                      <div>
                        <p className="font-pixel text-xs text-muted-foreground">STATS</p>
                        <div className="flex space-x-2">
                          <p className="font-pixel text-xs" title="Aces">
                            A:{pongMatch.details.playerStats[player.id].aces}
                          </p>
                          <p className="font-pixel text-xs" title="Errors">
                            E:{pongMatch.details.playerStats[player.id].errors}
                          </p>
                          <p className="font-pixel text-xs" title="Power Hits">
                            P:{pongMatch.details.playerStats[player.id].powerHits}
                          </p>
                        </div>
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
              <Button variant="default" className="font-pixel text-xs">
                WATCH REPLAY
              </Button>
            </DialogFooter>
          </div>
        )}

        {isDino && dinoRun && (
          <div className="space-y-4 animate-slideUp">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-pixel text-xs text-muted-foreground">RUN INFO</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p className="font-pixel text-xs">DURATION:</p>
                  <p className="font-pixel text-xs">{dinoRun.details.duration}</p>
                  <p className="font-pixel text-xs">OBSTACLES:</p>
                  <p className="font-pixel text-xs">{dinoRun.details.obstacles}</p>
                  <p className="font-pixel text-xs">POWER-UPS:</p>
                  <p className="font-pixel text-xs">{dinoRun.details.powerUps}</p>
                  <p className="font-pixel text-xs">DISTANCE:</p>
                  <p className="font-pixel text-xs">{dinoRun.details.distance}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-pixel text-xs text-muted-foreground">ACTIONS</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p className="font-pixel text-xs">JUMPS:</p>
                  <p className="font-pixel text-xs">{dinoRun.details.jumps}</p>
                  <p className="font-pixel text-xs">DUCKS:</p>
                  <p className="font-pixel text-xs">{dinoRun.details.ducks}</p>
                  <p className="font-pixel text-xs">COINS:</p>
                  <p className="font-pixel text-xs">{dinoRun.details.coins}</p>
                </div>
              </div>
            </div>

            {dinoRun.details.achievements.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-pixel text-xs text-muted-foreground">ACHIEVEMENTS</h3>
                <div className="flex flex-wrap gap-2">
                  {dinoRun.details.achievements.map((achievement, i) => (
                    <Badge key={i} className="font-pixel text-xs bg-game-orange">
                      {achievement}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button variant="outline" className="font-pixel text-xs mr-2">
                  CLOSE
                </Button>
              </DialogClose>
              <Button variant="default" className="font-pixel text-xs">
                WATCH REPLAY
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// Add these styles to the global CSS
const styles = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out forwards;
}

.animate-slideUp {
  animation: slideUp 0.4s ease-out forwards;
  animation-delay: 0.1s;
  opacity: 0;
}
`

// This is just to make the styles available, but they won't actually be used
// We'll add them to globals.css
const unusedStyles = styles
