"use client"

import Image from "next/image"
import { Trophy } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

type Player = {
  name: string
  avatar: string | null
}

type Match = {
  id: number
  round: string
  player1: Player
  player2: Player
  isLive: boolean
}

type UpcomingMatchesProps = {
  matches: Match[]
  gameType: string
  dict: any
}

const redirectToPlay = () => {
  window.location.href = `/games/pong/local`
}

export function UpcomingMatches({ matches, gameType }: UpcomingMatchesProps) {
  const gameColor = gameType === "pong" ? "game-blue" : "game-orange"

  return (
    <div className="space-y-4">
      {matches.length === 0 ? (
        <div className="text-center py-8">
          <p className="font-pixel text-sm text-muted-foreground uppercase">No upcoming matches</p>
        </div>
      ) : (
        matches.map((match) => {

          return (
            <div
              key={match.id}
              className={cn(
                "pixel-border border-2 rounded-md overflow-hidden",
                match.isLive ? `border-${gameColor}` : "border-muted",
              )}
            >
              <div className={`bg-${gameColor}/10 px-4 py-2 flex justify-between items-center`}>
                <div className="flex items-center">
                  <Trophy className={`h-4 w-4 mr-2 text-${gameColor}`} />
                  <span className="font-pixel text-xs uppercase">{match.round}</span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                        <div
                          className={`w-10 h-10 rounded-full bg-${gameColor}/20 flex items-center justify-center mr-3`}
                        >
                          <span className="font-pixel text-xs uppercase">{match.player1.name.charAt(0)}</span>
                        </div>
                      <span className="font-pixel text-sm uppercase">{match.player1.name}</span>
                    </div>
                  </div>

                  <div className="px-4">
                    <div className={`font-pixel text-lg text-${gameColor} uppercase`}>VS</div>
                  </div>

                  <div className="flex-1 text-right">
                    <div className="flex items-center justify-end">
                      <span className="font-pixel text-sm uppercase">{match.player2.name}</span>
                      {match.player2.avatar ? (
                        <Image
                          src={match.player2.avatar || "/placeholder.svg"}
                          alt={match.player2.name}
                          width={40}
                          height={40}
                          className="rounded-full ml-3"
                        />
                      ) : (
                        <div
                          className={`w-10 h-10 rounded-full bg-${gameColor}/20 flex items-center justify-center ml-3`}
                        >
                          <span className="font-pixel text-xs uppercase">{match.player2.name.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {match.isLive && (
                  <div className="flex justify-center mt-4">
                    <Button
					className={`font-pixel text-xs uppercase bg-${gameColor} hover:bg-${gameColor}/90`}
          			onClick={redirectToPlay}
					>
                      PLAY LOCAL
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
