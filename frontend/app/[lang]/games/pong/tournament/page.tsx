"use client"

import React, { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { TournamentBracket } from "@/components/TournamentBracket"
import { UpcomingMatches } from "@/components/UpcomingMatches"
import { useToast } from "@/hooks/UseToast"

type Player = {
  name: string
  score: number | null
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

type TournamentData = {
  isActive: boolean
  participants: number
  rounds: number
  currentRound: number
  bracketData: BracketData
  upcomingMatches: any[]
}

const getTournamentData = (gameType: string): TournamentData => {
  const isActive = true
  const participants = 8
  const rounds = 3
  const currentRound = 2

  // Tournament bracket data
  const bracketData = {
    rounds: [
      {
        name: "Quarter Finals",
        matches: [
          {
            id: 1,
            player1: { name: "Player 1", score: 10 },
            player2: { name: "Player 2", score: 8 },
            winner: "player1",
            completed: true,
          },
          {
            id: 2,
            player1: { name: "Player 3", score: 10 },
            player2: { name: "Player 4", score: 5 },
            winner: "player1",
            completed: true,
          },
          {
            id: 3,
            player1: { name: "Player 5", score: 7 },
            player2: { name: "Player 6", score: 10 },
            winner: "player2",
            completed: true,
          },
          {
            id: 4,
            player1: { name: "Player 7", score: 10 },
            player2: { name: "Player 8", score: 9 },
            winner: "player1",
            completed: true,
          },
        ],
      },
      {
        name: "Semi Finals",
        matches: [
          {
            id: 5,
            player1: { name: "Player 1", score: 10 },
            player2: { name: "Player 3", score: 8 },
            winner: "player1",
            completed: true,
          },
          {
            id: 6,
            player1: { name: "Player 6", score: 7 },
            player2: { name: "Player 7", score: 10 },
            winner: "player2",
            completed: true,
          },
        ],
      },
      {
        name: "Final",
        matches: [
          {
            id: 7,
            player1: { name: "Player 1", score: null },
            player2: { name: "TBD", score: null },
            winner: null,
            completed: false,
          },
        ],
      },
    ],
  }

  // Upcoming matches - only one match for local tournament
  const upcomingMatches = [
    {
      id: 7,
      round: "Final",
      player1: { name: "Player 1", avatar: "/abstract-geometric-sculpture.png" },
      player2: { name: "TBD", avatar: null },
      scheduledTime: "2025-05-18T19:00:00Z",
      isLive: true,
    },
    {
      id: 8,
      round: "Final",
      player1: { name: "Player 1", avatar: "/abstract-geometric-sculpture.png" },
      player2: { name: "TBD", avatar: null },
      scheduledTime: "2025-05-18T19:00:00Z",
      isLive: false,
    },
    {
      id: 9,
      round: "Final",
      player1: { name: "Player 1", avatar: "/abstract-geometric-sculpture.png" },
      player2: { name: "TBD", avatar: null },
      scheduledTime: "2025-05-18T19:00:00Z",
      isLive: false,
    },
    {
      id: 10,
      round: "Final",
      player1: { name: "Player 1", avatar: "/abstract-geometric-sculpture.png" },
      player2: { name: "TBD", avatar: null },
      scheduledTime: "2025-05-18T19:00:00Z",
      isLive: false,
    },
  ]

  return {
    isActive,
    participants,
    rounds,
    currentRound,
    bracketData,
    upcomingMatches,
  }
}

export default function TournamentPage({
  params,
}: {
  params: Promise<{ gameType: string }>
}) {
  // Use React.use to unwrap the params Promise
  const unwrappedParams = React.use(params)
  const { gameType } = unwrappedParams

  const { toast } = useToast()

  // State to manage tournament data
  const [tournamentData, setTournamentData] = useState<TournamentData>(getTournamentData(gameType))

  // Determine game color
  const gameColor = "game-blue"

  // Handle adding a local player
  const handleInvitePlayer = (matchId: number, slotNumber: 1 | 2, playerName: string) => {
    // Update the tournament data
    const updatedTournamentData = { ...tournamentData }

    // Find the match and update the player
    const roundIndex = updatedTournamentData.bracketData.rounds.findIndex((round) =>
      round.matches.some((match) => match.id === matchId),
    )

    if (roundIndex !== -1) {
      const matchIndex = updatedTournamentData.bracketData.rounds[roundIndex].matches.findIndex(
        (match) => match.id === matchId,
      )

      if (matchIndex !== -1) {
        if (slotNumber === 1) {
          updatedTournamentData.bracketData.rounds[roundIndex].matches[matchIndex].player1 = {
            name: playerName,
            score: null,
          }
        } else {
          updatedTournamentData.bracketData.rounds[roundIndex].matches[matchIndex].player2 = {
            name: playerName,
            score: null,
          }
        }
      }
    }

    // Also update upcoming matches if needed
    const upcomingMatchIndex = updatedTournamentData.upcomingMatches.findIndex((match) => match.id === matchId)

    if (upcomingMatchIndex !== -1) {
      if (slotNumber === 1) {
        updatedTournamentData.upcomingMatches[upcomingMatchIndex].player1.name = playerName
      } else {
        updatedTournamentData.upcomingMatches[upcomingMatchIndex].player2.name = playerName
      }
    }

    // Update state
    setTournamentData(updatedTournamentData)

    // Show toast notification
    toast({
      title: "Local Player Added",
      description: `Added ${playerName} to match #${matchId}`,
      duration: 3000,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8 mx-auto">
        {/* Header Section */}
        <section className={`mb-12 pb-8 border-b border-${gameColor}/20`}>
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="sm" className={`font-pixel text-xs text-${gameColor}`} asChild>
              <Link href={`/`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                BACK
              </Link>
            </Button>
          </div>

          <h1 className={`font-pixel text-2xl md:text-3xl text-${gameColor} uppercase mb-6`}>PONG TOURNAMENT</h1>
        </section>

        {/* Tournament Bracket Section */}
        <section className={`mb-12 pb-8 border-b border-${gameColor}/20`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`font-pixel text-xl text-${gameColor} uppercase`}>Tournament Bracket</h2>
            <Badge className={`font-pixel text-xs bg-${gameColor}/10 text-${gameColor}`}>
              ROUND {tournamentData.currentRound}
            </Badge>
          </div>
          <div className={`bg-${gameColor}/5 rounded-lg p-6`}>
            <div className="overflow-x-auto pb-4">
              <div className="min-w-[600px] max-w-[800px] mx-auto">
                <TournamentBracket
                  bracketData={tournamentData.bracketData}
                  gameType="pong"
                  onInvitePlayer={handleInvitePlayer}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Matches Section */}
        <section className={`mb-12 pb-8 border-b border-${gameColor}/20`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`font-pixel text-xl text-${gameColor} uppercase`}>Upcoming Matches</h2>
          </div>
          <div className={`bg-${gameColor}/5 rounded-lg p-6`}>
            <UpcomingMatches
              matches={tournamentData.upcomingMatches}
              gameType="pong"
              dict={{ common: { play: "PLAY" } }}
            />
          </div>
        </section>
      </div>
    </div>
  )
}
