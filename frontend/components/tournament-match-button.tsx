"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Gamepad2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/Button"

type TournamentMatchButtonProps = {
  matchId: number
  gameType: string
  isPlayerParticipant: boolean
  isMatchReady: boolean
  isCompleted: boolean
  gameColor: string
}

export function TournamentMatchButton({
  matchId,
  gameType,
  isPlayerParticipant,
  isMatchReady,
  isCompleted,
  gameColor,
}: TournamentMatchButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handlePlayMatch = () => {
    setIsLoading(true)

    // Save tournament state to localStorage before navigating
    const tournamentState = {
      returnPath: `/games/${gameType}/tournament`,
      matchId: matchId,
      timestamp: new Date().toISOString(),
    }

    localStorage.setItem("tournamentState", JSON.stringify(tournamentState))

    // Navigate to the game page with tournament match ID
    router.push(`/games/${gameType}/play?matchId=${matchId}&mode=tournament`)
  }

  if (isCompleted) {
    return (
      <Button
        variant="outline"
        size="sm"
        className={`font-pixel text-xs uppercase text-${gameColor}`}
        onClick={() => router.push(`/games/${gameType}/match/${matchId}`)}
      >
        VIEW RESULTS
      </Button>
    )
  }

  if (!isPlayerParticipant) {
    return (
      <Button variant="outline" size="sm" className="font-pixel text-xs uppercase" disabled>
        NOT YOUR MATCH
      </Button>
    )
  }

  if (!isMatchReady) {
    return (
      <Button variant="outline" size="sm" className="font-pixel text-xs uppercase" disabled>
        WAITING FOR OPPONENT
      </Button>
    )
  }

  return (
    <Button
      className={`font-pixel text-xs uppercase bg-${gameColor} hover:bg-${gameColor}/90`}
      size="sm"
      onClick={handlePlayMatch}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          LOADING GAME
        </>
      ) : (
        <>
          <Gamepad2 className="mr-2 h-4 w-4" />
          PLAY MATCH
        </>
      )}
    </Button>
  )
}
