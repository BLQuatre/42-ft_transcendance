"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Users, Crown, CheckCircle, XCircle, Home, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { cn } from "@/lib/Utils"
import { use } from "react"

// Types
type Player = {
  id: string
  name: string
  avatar: string | null
  isHost: boolean
  isReady: boolean
  isYou: boolean
}

type GameRoom = {
  id: string
  name: string
  gameType: string
  maxPlayers: number
  status: "waiting" | "starting" | "in-progress" | "finished"
  isPrivate: boolean
  createdAt: string
  players: Player[]
}

export default function GameRoomPage({
  params,
  searchParams,
}: {
  params: Promise<{ gameType: string; roomId: string }>
  searchParams: Promise<{ players?: string }>
}) {
  const unwrappedParams = use(params)
  const unwrappedSearchParams = use(searchParams)
  const { gameType, roomId } = unwrappedParams
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(true)
  const [room, setRoom] = useState<GameRoom | null>(null)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)
  const isPong = gameType === "pong"

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    // Simulate API call
    const fetchGameRoom = async () => {
      setIsLoading(true)

      // Mock data
      const playerCount = Number.parseInt(unwrappedSearchParams.players || "2", 10)
      const mockRoom: GameRoom = {
        id: roomId,
        name: `${gameType.toUpperCase()} Room #${roomId ? roomId.slice(-1) : "1"}`,
        gameType,
        maxPlayers: playerCount,
        status: "waiting",
        isPrivate: false,
        createdAt: new Date(Date.now() - 5 * 60000).toISOString(), // 5 minutes ago
        players: Array.from({ length: Math.min(playerCount, 4) }, (_, index) => {
          if (index === 0) {
            return {
              id: `player${index + 1}`,
              name: "Player 1",
              avatar: "/abstract-user-avatar.png",
              isHost: true,
              isReady: true,
              isYou: false,
            }
          } else if (index === 1) {
            return {
              id: `player${index + 1}`,
              name: "You",
              avatar: null,
              isHost: false,
              isReady: false,
              isYou: true,
            }
          } else {
            return {
              id: `player${index + 1}`,
              name: `Player ${index + 1}`,
              avatar: index % 2 === 0 ? "/user-profile-illustration.png" : null,
              isHost: false,
              isReady: true,
              isYou: false,
            }
          }
        }),
      }

      setRoom(mockRoom)
      setIsLoading(false)
    }

    fetchGameRoom()
  }, [roomId, gameType, unwrappedSearchParams])

  // Toggle ready status for current player
  const toggleReady = () => {
    if (!room) return

    const updatedPlayers = room.players.map((player) => {
      if (player.isYou) {
        return { ...player, isReady: !player.isReady }
      }
      return player
    })

    setRoom({ ...room, players: updatedPlayers })

    // Check if all players are ready
    const allReady = updatedPlayers.every((player) => player.isReady)
    if (allReady && room.status === "waiting") {
      startCountdown()
    } else if (!allReady && countdown !== null) {
      // Cancel countdown if someone becomes not ready
      setCountdown(null)
      setRoom({ ...room, status: "waiting" })
    }
  }

  // Start countdown when all players are ready
  const startCountdown = () => {
    if (room) {
      setRoom({ ...room, status: "starting" })
      setCountdown(5)
    }
  }

  // Handle countdown
  useEffect(() => {
    if (countdown === null || !room) return

    const timer = setTimeout(() => {
      if (countdown > 1) {
        setCountdown(countdown - 1)
      } else {
        // Start the game
        setCountdown(null)
        setRoom({ ...room, status: "in-progress" })
        // Navigate to the actual game
        router.push(`/games/${gameType}/play/${roomId}`)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [countdown, room, router, gameType, roomId])

  // Copy room code to clipboard
  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomId)
    setCopied(true)

    // Reset copied state after 2 seconds
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  if (isLoading || !room) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="font-pixel text-lg animate-pulse">LOADING GAME ROOM...</div>
      </div>
    )
  }

  const currentPlayer = room.players.find((player) => player.isYou)

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-6 mx-auto max-w-5xl">
        {/* Back Button - with more space below */}
        <div className="mb-8">
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "font-pixel text-xs flex items-center gap-2 border-2",
              isPong
                ? "border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                : "border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white",
            )}
            asChild
          >
            <Link href="/">
              <Home className="h-4 w-4" />
              BACK TO HOME
            </Link>
          </Button>
        </div>

        {/* Room Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1
                className={cn(
                  "font-pixel text-xl md:text-2xl uppercase mb-1",
                  isPong ? "text-blue-500" : "text-orange-500",
                )}
              >
                {room.name}
              </h1>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-pixel text-xs">
                  {gameType.toUpperCase()}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    "font-pixel text-xs",
                    room.status === "waiting"
                      ? "bg-yellow-500/10 text-yellow-500"
                      : room.status === "starting"
                        ? "bg-blue-500/10 text-blue-500"
                        : "bg-green-500/10 text-green-500",
                  )}
                >
                  {room.status === "waiting"
                    ? "LOBBY"
                    : room.status === "starting"
                      ? `STARTING IN ${countdown}`
                      : "IN PROGRESS"}
                </Badge>
              </div>
            </div>

            {room.status === "waiting" && (
              <Button
                className={cn(
                  "font-pixel text-sm uppercase w-full md:w-auto",
                  currentPlayer?.isReady
                    ? "bg-red-500 hover:bg-red-600"
                    : isPong
                      ? "bg-blue-500 hover:bg-blue-600"
                      : "bg-orange-500 hover:bg-orange-600",
                )}
                onClick={toggleReady}
              >
                {currentPlayer?.isReady ? (
                  <>
                    <XCircle className="mr-2 h-4 w-4" />
                    CANCEL READY
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    I'M READY
                  </>
                )}
              </Button>
            )}

            {room.status === "starting" && (
              <div className="font-pixel text-xl text-center w-full md:w-auto">
                GAME STARTING IN <span className={cn(isPong ? "text-blue-500" : "text-orange-500")}>{countdown}</span>
              </div>
            )}
          </div>
        </div>

        {/* Room Code Section */}
        <div
          className={cn(
            "p-4 rounded-md mb-6 flex items-center justify-between",
            isPong ? "bg-blue-500/10" : "bg-orange-500/10",
          )}
        >
          <div>
            <div className="font-pixel text-xs text-muted-foreground mb-1">ROOM CODE</div>
            <div className="font-pixel text-lg tracking-wider">{roomId.toUpperCase()}</div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "font-pixel text-xs border-2 transition-all",
              copied
                ? "bg-green-500 text-white border-green-500"
                : isPong
                  ? "border-blue-500 hover:bg-blue-500 hover:text-white"
                  : "border-orange-500 hover:bg-orange-500 hover:text-white",
            )}
            onClick={copyRoomCode}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                COPIED!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-1" />
                COPY CODE
              </>
            )}
          </Button>
        </div>

        {/* Players Section - No box/border */}
        <div>
          {/* Players Header */}
          <div
            className={cn(
              "px-4 py-2 flex justify-between items-center rounded-t-md mb-3",
              isPong ? "bg-blue-500/10" : "bg-orange-500/10",
            )}
          >
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              <h3 className="font-pixel text-sm uppercase">Players</h3>
            </div>
            <span className="font-pixel text-xs text-muted-foreground">
              {room.players.length}/{room.maxPlayers}
            </span>
          </div>

          {/* Players Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {/* Render actual players */}
            {room.players.map((player) => (
              <div
                key={player.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-md",
                  player.isYou ? (isPong ? "bg-blue-500/10" : "bg-orange-500/10") : "bg-muted/30",
                )}
              >
                <div className="flex items-center">
                  {player.avatar ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                      <Image
                        src={player.avatar || "/placeholder.svg"}
                        alt={player.name}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mr-3">
                      <span className="font-pixel text-lg text-muted-foreground">{player.name.charAt(0)}</span>
                    </div>
                  )}
                  <div>
                    <div className="flex items-center">
                      <span className="font-pixel text-sm">
                        {player.name}
                        {player.isYou && " (You)"}
                      </span>
                      {player.isHost && <Crown className="ml-2 h-4 w-4 text-yellow-500" />}
                    </div>
                    <span className="font-pixel text-xs text-muted-foreground">
                      {player.isHost ? "Host" : "Player"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center">
                  {player.isReady ? (
                    <Badge className="font-pixel text-xs bg-green-500">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      READY
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="font-pixel text-xs text-muted-foreground">
                      <XCircle className="mr-1 h-3 w-3" />
                      NOT READY
                    </Badge>
                  )}
                </div>
              </div>
            ))}

            {/* Render empty slots */}
            {Array.from({ length: room.maxPlayers - room.players.length }, (_, index) => (
              <div
                key={`empty-slot-${index}`}
                className="flex items-center justify-between p-3 rounded-md border border-dashed border-muted bg-muted/10"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-muted/30 flex items-center justify-center mr-3">
                    <Users className="h-5 w-5 text-muted-foreground/50" />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <span className="font-pixel text-sm text-muted-foreground/70">Waiting for player...</span>
                    </div>
                    <span className="font-pixel text-xs text-muted-foreground/50">Empty slot</span>
                  </div>
                </div>

                <div className="flex items-center">
                  <Badge variant="outline" className="font-pixel text-xs text-muted-foreground/50 border-dashed">
                    OPEN
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {room.status === "waiting" && (
            <div className="text-center">
              <p className="font-pixel text-xs text-muted-foreground">
                Game will start automatically when all players are ready
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
