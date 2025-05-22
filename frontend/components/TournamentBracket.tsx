"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { UserPlus } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { InvitePlayerDialog } from "./dialog/InvitePlayerDialog"

type Player = {
  name: string
  score: number | null
  isBot?: boolean
}

type Match = {
  id: number
  player1: Player
  player2: Player
  winner: string | null
  completed: boolean
}

type Round = {
  name: string
  matches: Match[]
}

type BracketData = {
  rounds: Round[]
}

type TournamentBracketProps = {
  bracketData: BracketData
  gameType: "pong" | "dino"
  onInvitePlayer?: (matchId: number, slotNumber: 1 | 2, playerId: string) => void
  onAddBot?: (matchId: number, slotNumber: 1 | 2) => void
}

export function TournamentBracket({
  bracketData,
  gameType,
  onInvitePlayer = () => {},
  onAddBot = () => {},
}: TournamentBracketProps) {
  const [hoveredMatch, setHoveredMatch] = useState<number | null>(null)
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [currentInvite, setCurrentInvite] = useState<{ matchId: number; slotNumber: 1 | 2 } | null>(null)

  const gameColor = gameType === "pong" ? "game-blue" : "game-orange"

  const handleOpenInviteDialog = (matchId: number, slotNumber: 1 | 2) => {
    setCurrentInvite({ matchId, slotNumber })
    setInviteDialogOpen(true)
  }

  const isEmptySlot = (playerName: string) => {
    return playerName === "TBD" || playerName === "" || playerName === "Empty"
  }

  return (
    <>
      <div className="flex justify-between">
        {bracketData.rounds.map((round, roundIndex) => (
          <div
            key={roundIndex}
            className={cn(
              "flex flex-col",
              roundIndex > 0 && "ml-6",
              roundIndex < bracketData.rounds.length - 1 && "mr-6",
            )}
            style={{
              flex: 1,
              position: "relative",
              zIndex: 10 - roundIndex, // Ensure later rounds are on top for connector lines
            }}
          >
            <div className={`font-pixel text-xs text-${gameColor} uppercase mb-3 text-center`}>{round.name}</div>

            <div
              className="flex flex-col justify-around h-full"
              style={{
                gap: `${Math.pow(2, roundIndex) * 16}px`,
                marginTop: `${Math.pow(2, roundIndex - 1) * 8}px`,
                marginBottom: `${Math.pow(2, roundIndex - 1) * 8}px`,
              }}
            >
              {round.matches.map((match, matchIndex) => (
                <div
                  key={match.id}
                  className={cn(
                    "relative",
                    roundIndex < bracketData.rounds.length - 1 && "connector-right",
                    roundIndex > 0 && "connector-left",
                  )}
                  onMouseEnter={() => setHoveredMatch(match.id)}
                  onMouseLeave={() => setHoveredMatch(null)}
                >
                  <div
                    className={cn(
                      "pixel-border border-2 rounded-md overflow-hidden transition-all",
                      hoveredMatch === match.id ? `border-${gameColor}` : "border-muted",
                      match.completed ? "opacity-100" : "opacity-80",
                    )}
                  >
                    {/* Player 1 */}
                    <div
                      className={cn(
                        "flex justify-between items-center p-1.5",
                        match.winner === "player1" ? `bg-${gameColor} text-white` : "bg-muted/50",
                        match.completed && match.winner !== "player1" && "text-muted-foreground",
                        isEmptySlot(match.player1.name) && "bg-muted/30",
                      )}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-pixel text-xs uppercase truncate max-w-[100px]">
                          {isEmptySlot(match.player1.name) ? "EMPTY SLOT" : match.player1.name}
                          {match.player1.isBot && " (BOT)"}
                        </span>

                        {isEmptySlot(match.player1.name) ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-6 px-2 font-pixel text-[10px] uppercase text-${gameColor}`}
                            onClick={() => handleOpenInviteDialog(match.id, 1)}
                          >
                            <UserPlus className="h-3 w-3 mr-1" />
                            ADD PLAYER
                          </Button>
                        ) : (
                          <span className="font-pixel text-xs font-bold ml-2">
                            {match.player1.score !== null ? match.player1.score : "-"}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-[1px] bg-muted w-full"></div>

                    {/* Player 2 */}
                    <div
                      className={cn(
                        "flex justify-between items-center p-1.5",
                        match.winner === "player2" ? `bg-${gameColor} text-white` : "bg-muted/50",
                        match.completed && match.winner !== "player2" && "text-muted-foreground",
                        isEmptySlot(match.player2.name) && "bg-muted/30",
                      )}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-pixel text-xs uppercase truncate max-w-[100px]">
                          {isEmptySlot(match.player2.name) ? "EMPTY SLOT" : match.player2.name}
                          {match.player2.isBot && " (BOT)"}
                        </span>

                        {isEmptySlot(match.player2.name) ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-6 px-2 font-pixel text-[10px] uppercase text-${gameColor}`}
                            onClick={() => handleOpenInviteDialog(match.id, 2)}
                          >
                            <UserPlus className="h-3 w-3 mr-1" />
                            ADD PLAYER
                          </Button>
                        ) : (
                          <span className="font-pixel text-xs font-bold ml-2">
                            {match.player2.score !== null ? match.player2.score : "-"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Invite Player Dialog */}
      {currentInvite && (
        <InvitePlayerDialog
          open={inviteDialogOpen}
          onOpenChange={setInviteDialogOpen}
          matchId={currentInvite.matchId}
          slotNumber={currentInvite.slotNumber}
          gameType={gameType}
          onInvite={onInvitePlayer}
          onAddBot={onAddBot}
        />
      )}
    </>
  )
}
