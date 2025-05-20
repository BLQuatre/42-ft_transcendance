"use client"

import React, { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, Trophy, Users } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { TournamentBracket } from "@/components/TournamentBracket"
import { UpcomingMatches } from "@/components/UpcomingMatches"
import { useToast } from "@/hooks/use-toast"

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

type TournamentData = {
  isActive: boolean
  startDate: string
  endDate: string
  participants: number
  rounds: number
  currentRound: number
  bracketData: BracketData
  upcomingMatches: any[]
}

// This would typically come from an API or database
const getTournamentData = (gameType: string): TournamentData => {
  // Mock data for demonstration
  const isActive = true
  const startDate = "2025-05-20T18:00:00Z"
  const endDate = "2025-05-25T22:00:00Z"
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

  // Upcoming matches
  const upcomingMatches = [
    {
      id: 7,
      round: "Final",
      player1: { name: "Player 1", avatar: "/abstract-geometric-sculpture.png" },
      player2: { name: "TBD", avatar: null },
      scheduledTime: "2025-05-18T19:00:00Z",
      isLive: false,
    },
  ]

  return {
    isActive,
    startDate,
    endDate,
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

  // Format dates
  const startDate = new Date(tournamentData.startDate)
  const endDate = new Date(tournamentData.endDate)
  const formattedDateRange = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`

  // Determine game color
  const gameColor = gameType === "pong" ? "game-blue" : "game-orange"

  // Handle inviting a player
  const handleInvitePlayer = (matchId: number, slotNumber: 1 | 2, playerId: string) => {
    // In a real app, you would send an API request to invite the player

    // Find the friend's name from the playerId
    const friendName =
      playerId === "friend1"
        ? "Alex Johnson"
        : playerId === "friend2"
          ? "Sam Wilson"
          : playerId === "friend3"
            ? "Taylor Kim"
            : playerId === "friend4"
              ? "Jordan Smith"
              : playerId === "friend5"
                ? "Casey Brown"
                : "Unknown Player"

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
            name: friendName,
            score: null,
          }
        } else {
          updatedTournamentData.bracketData.rounds[roundIndex].matches[matchIndex].player2 = {
            name: friendName,
            score: null,
          }
        }
      }
    }

    // Also update upcoming matches if needed
    const upcomingMatchIndex = updatedTournamentData.upcomingMatches.findIndex((match) => match.id === matchId)

    if (upcomingMatchIndex !== -1) {
      if (slotNumber === 1) {
        updatedTournamentData.upcomingMatches[upcomingMatchIndex].player1.name = friendName
      } else {
        updatedTournamentData.upcomingMatches[upcomingMatchIndex].player2.name = friendName
      }
    }

    // Update state
    setTournamentData(updatedTournamentData)

    // Show toast notification
    toast({
      title: "Player Invited",
      description: `Invitation sent to ${friendName} for match #${matchId}`,
      duration: 3000,
    })
  }

  // Handle adding a bot
  const handleAddBot = (matchId: number, slotNumber: 1 | 2) => {
    // In a real app, you would send an API request to add the bot

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
            name: "Tournament Bot",
            score: null,
            isBot: true,
          }
        } else {
          updatedTournamentData.bracketData.rounds[roundIndex].matches[matchIndex].player2 = {
            name: "Tournament Bot",
            score: null,
            isBot: true,
          }
        }
      }
    }

    // Also update upcoming matches if needed
    const upcomingMatchIndex = updatedTournamentData.upcomingMatches.findIndex((match) => match.id === matchId)

    if (upcomingMatchIndex !== -1) {
      if (slotNumber === 1) {
        updatedTournamentData.upcomingMatches[upcomingMatchIndex].player1.name = "Tournament Bot"
      } else {
        updatedTournamentData.upcomingMatches[upcomingMatchIndex].player2.name = "Tournament Bot"
      }
    }

    // Update state
    setTournamentData(updatedTournamentData)

    // Show toast notification
    toast({
      title: "Bot Added",
      description: `Added bot to match #${matchId}`,
      duration: 3000,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8 mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="sm" className={`font-pixel text-xs text-${gameColor}`} asChild>
              <Link href={`/games/${gameType}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                BACK
              </Link>
            </Button>

            <Badge
              variant="outline"
              className={`font-pixel text-xs ${tournamentData.isActive ? `bg-${gameColor}/10 text-${gameColor}` : ""}`}
            >
              {tournamentData.isActive ? "ACTIVE TOURNAMENT" : "UPCOMING TOURNAMENT"}
            </Badge>
          </div>

          <h1 className={`font-pixel text-2xl md:text-3xl text-${gameColor} uppercase mb-2`}>
            {gameType === "pong" ? "PONG" : "DINO RUN"} TOURNAMENT
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className={`flex items-center p-4 rounded-md bg-${gameColor}/10`}>
              <Calendar className={`h-5 w-5 mr-3 text-${gameColor}`} />
              <div>
                <p className="font-pixel text-xs text-muted-foreground uppercase">DATES</p>
                <p className="font-pixel text-sm uppercase">{formattedDateRange}</p>
              </div>
            </div>

            <div className={`flex items-center p-4 rounded-md bg-${gameColor}/10`}>
              <Users className={`h-5 w-5 mr-3 text-${gameColor}`} />
              <div>
                <p className="font-pixel text-xs text-muted-foreground uppercase">PARTICIPANTS</p>
                <p className="font-pixel text-sm uppercase">{tournamentData.participants} PLAYERS</p>
              </div>
            </div>

            <div className={`flex items-center p-4 rounded-md bg-${gameColor}/10`}>
              <Trophy className={`h-5 w-5 mr-3 text-${gameColor}`} />
              <div>
                <p className="font-pixel text-xs text-muted-foreground uppercase">CURRENT ROUND</p>
                <p className="font-pixel text-sm uppercase">
                  {tournamentData.currentRound} OF {tournamentData.rounds}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tournament Bracket */}
        <div className="mb-12">
          <h2 className={`font-pixel text-xl text-${gameColor} uppercase mb-6`}>Tournament Bracket</h2>
          <div className="overflow-x-auto pb-4">
            <div className="min-w-[600px] max-w-[800px] mx-auto">
              <TournamentBracket
                bracketData={tournamentData.bracketData}
                gameType={gameType}
                onInvitePlayer={handleInvitePlayer}
                onAddBot={handleAddBot}
              />
            </div>
          </div>
        </div>

        {/* Upcoming Matches */}
        <div>
          <h2 className={`font-pixel text-xl text-${gameColor} uppercase mb-6`}>Upcoming Matches</h2>
          <UpcomingMatches
            matches={tournamentData.upcomingMatches}
            gameType={gameType}
            dict={{ common: { play: "PLAY" } }}
          />
        </div>
      </div>
    </div>
  )
}
