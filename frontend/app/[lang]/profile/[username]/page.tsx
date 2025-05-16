"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { UserPlus, MessageSquare, Trophy, GamepadIcon, BarChart3 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { MatchDetailsDialog } from "@/components/match-details-dialog"
import { useDictionary } from "@/hooks/use-dictionnary"
import Loading from "@/components/loading"
import { Line, LineChart, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"

// Sample data for charts - from dashboard
const gamePlayData = [
  { name: "Mon", pong: 4, dino: 2 },
  { name: "Tue", pong: 3, dino: 5 },
  { name: "Wed", pong: 5, dino: 3 },
  { name: "Thu", pong: 7, dino: 4 },
  { name: "Fri", pong: 5, dino: 6 },
  { name: "Sat", pong: 8, dino: 9 },
  { name: "Sun", pong: 10, dino: 7 },
]

const scoreData = [
  { name: "Week 1", score: 350 },
  { name: "Week 2", score: 420 },
  { name: "Week 3", score: 380 },
  { name: "Week 4", score: 510 },
]

// Sample game history data with support for multiple players (up to 8) - from dashboard
const pongHistory = [
  {
    id: "match-001",
    type: "TEAM MATCH",
    result: "LOOSE",
    date: "04/20/2023",
    players: [
      { id: "player-001", name: "PLAYER_ONE", team: "ALPHA", score: 10, isUser: true },
      { id: "player-002", name: "GAMER42", team: "BETA", score: 5, isUser: false },
      { id: "player-003", name: "PIXEL_PRO", team: "ALPHA", score: 8, isUser: false },
      { id: "player-004", name: "RETRO_KID", team: "BETA", score: 6, isUser: false },
      { id: "player-005", name: "RETRO_KID", team: "BETA", score: 6, isUser: false },
      { id: "player-006", name: "RETRO_KID", team: "BETA", score: 6, isUser: false },
      { id: "player-007", name: "RETRO_KID", team: "BETA", score: 6, isUser: false },
      { id: "player-008", name: "RETRO_KID", team: "BETA", score: 6, isUser: false },
    ],
  },
  {
    id: "match-002",
    type: "1V1 MATCH",
    result: "WIN",
    date: "04/18/2023",
    players: [
      { id: "player-001", name: "PLAYER_ONE", team: "ALPHA", score: 10, isUser: true },
      { id: "player-002", name: "PIXEL_MASTER", team: "BETA", score: 8, isUser: false },
    ],
  },
]

const dinoHistory = [
  {
    id: "match-001",
    type: "TEAM MATCH",
    result: "WIN",
    date: "04/20/2023",
    players: [
      { id: "player-001", name: "PLAYER_ONE", team: "ALPHA", score: 10, isUser: true },
      { id: "player-002", name: "GAMER42", team: "BETA", score: 5, isUser: false },
      { id: "player-003", name: "PIXEL_PRO", team: "ALPHA", score: 8, isUser: false },
      { id: "player-004", name: "RETRO_KID", team: "BETA", score: 6, isUser: false },
      { id: "player-005", name: "RETRO_KID", team: "BETA", score: 6, isUser: false },
      { id: "player-006", name: "RETRO_KID", team: "BETA", score: 6, isUser: false },
      { id: "player-007", name: "RETRO_KID", team: "BETA", score: 6, isUser: false },
      { id: "player-008", name: "RETRO_KID", team: "BETA", score: 6, isUser: false },
    ],
  },
  {
    id: "match-002",
    type: "1V1 MATCH",
    result: "WIN",
    date: "04/18/2023",
    players: [
      { id: "player-001", name: "PLAYER_ONE", team: "ALPHA", score: 10, isUser: true },
      { id: "player-002", name: "PIXEL_MASTER", team: "BETA", score: 8, isUser: false },
    ],
  },
]

// Sample user data - in a real app, this would come from an API
const userData = {
  GAMER42: {
    username: "GAMER42",
    displayName: "The Gamer",
    avatar: "/placeholder.svg?height=100&width=100",
    joinDate: "04/12/2022",
    bio: "Retro gaming enthusiast. Pong champion and pixel art lover.",
    stats: {
      totalGames: 342,
      winRate: "68%",
      highScore: 1876,
    },
    gameStats: {
      pong: {
        played: 156,
        wins: 112,
        losses: 44,
        winRate: "72%",
        highScore: "15-3",
      },
      dino: {
        played: 186,
        highScore: 1876,
        avgScore: 756,
        totalDistance: "86km",
      },
    },
    // Will use dashboard's pongHistory and dinoHistory instead of these
    recentGames: [],
  },
  PIXEL_MASTER: {
    username: "PIXEL_MASTER",
    displayName: "Pixel Master",
    avatar: "/placeholder.svg?height=100&width=100",
    joinDate: "02/28/2022",
    bio: "Pixel art creator and retro game developer. I love creating and playing 8-bit style games!",
    stats: {
      totalGames: 512,
      winRate: "74%",
      highScore: 2048,
    },
    gameStats: {
      pong: {
        played: 210,
        wins: 168,
        losses: 42,
        winRate: "80%",
        highScore: "15-2",
      },
      dino: {
        played: 302,
        highScore: 2048,
        avgScore: 1024,
        totalDistance: "120km",
      },
    },
    // Will use dashboard's pongHistory and dinoHistory instead of these
    recentGames: [],
  },
  RETRO_FAN: {
    username: "RETRO_FAN",
    displayName: "Retro Fan",
    avatar: "/placeholder.svg?height=100&width=100",
    joinDate: "06/15/2022",
    bio: "Passionate about all things retro. Collector of vintage consoles and arcade machines.",
    stats: {
      totalGames: 256,
      winRate: "62%",
      highScore: 1542,
    },
    gameStats: {
      pong: {
        played: 124,
        wins: 82,
        losses: 42,
        winRate: "66%",
        highScore: "15-8",
      },
      dino: {
        played: 132,
        highScore: 1542,
        avgScore: 876,
        totalDistance: "64km",
      },
    },
    // Will use dashboard's pongHistory and dinoHistory instead of these
    recentGames: [],
  },
}

export default function UserProfilePage() {
  const params = useParams()
  const username = params.username as string
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFriend, setIsFriend] = useState(false)
  const { toast } = useToast()
  const [selectedMatch, setSelectedMatch] = useState<null | {
    type: "pong" | "dino"
    details: any
  }>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleMatchClick = (type: "pong" | "dino", details: any) => {
    setSelectedMatch({ type, details })
    setDialogOpen(true)
  }

  useEffect(() => {
    // Simulate API call to fetch user data
    setTimeout(() => {
      const foundUser = userData[username as keyof typeof userData]
      setUser(foundUser || null)
      setLoading(false)

      // Simulate checking if this is a friend
      setIsFriend(username === "GAMER42")
    }, 500)
  }, [username])

  const handleAddFriend = () => {
    setIsFriend(true)
    toast({
      title: "Demande d'ami envoyée",
      description: user
        ? `Une demande d'ami a été envoyée à ${user.username}`
        : `Erreur lors de l'envoi de la demande d'ami`,
      duration: 3000,
    })
  }

  const handleMessage = () => {
    toast({
      title: "Message",
      description: user
        ? `Ouverture de la conversation avec ${user.username}`
        : `Erreur lors de l'ouverture de la conversation`,
      duration: 3000,
    })
  }

  const dict = useDictionary()
  if (!dict) return null

  if (loading) {
    return <Loading dict={dict} />
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <MainNav />
        <div className="flex-1 container py-8 px-4 md:px-6 flex flex-col items-center justify-center">
          <h1 className="font-pixel text-2xl mb-4 uppercase">{dict.profile.notFound.replace("%user%", username)}</h1>
          <Button asChild className="font-pixel bg-game-blue hover:bg-game-blue/90">
            <Link href="/" className="uppercase">
              {dict.common.back}
            </Link>
          </Button>
        </div>
        <Footer dict={dict} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainNav />

      <div className="flex-1 container py-16 px-4 md:px-6">
        {/* User Header */}
        <div className="mb-8 bg-card rounded-lg p-6 pixel-border">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="relative">
              <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-game-blue">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
                <AvatarFallback className="font-pixel text-xl">{user.username.substring(0, 2)}</AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1 text-center md:text-left flex flex-col justify-center">
              <h1 className="font-pixel text-2xl md:text-3xl">{user.displayName}</h1>
              <p className="font-pixel text-xs text-muted-foreground mt-1">
                {dict.profile.memberSince.replace("%date%", user.joinDate)}
              </p>
              <p className="mt-4 text-sm">{user.bio}</p>
            </div>

            <div className="flex flex-col gap-2 mt-4 md:mt-0">
              {!isFriend ? (
                <Button className="font-pixel bg-game-blue hover:bg-game-blue/90 uppercase" onClick={handleAddFriend}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  {dict.profile.addFriend}
                </Button>
              ) : (
                <Button className="font-pixel bg-game-green hover:bg-game-green/90 uppercase" onClick={handleMessage}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {dict.profile.sendMessage}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="font-pixel text-xs overflow-x-auto w-full flex-nowrap">
            <TabsTrigger className="uppercase" value="overview">
              {dict.profile.sections.overview.title}
            </TabsTrigger>
            <TabsTrigger className="uppercase" value="history">
              {dict.profile.sections.history.title}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="font-pixel text-sm uppercase">
                    {dict.profile.sections.stats.gamesPlayed}
                  </CardTitle>
                  <GamepadIcon className="text-game-blue h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="font-pixel text-2xl">{user.stats.totalGames}</div>
                  <p className="font-pixel text-xs text-muted-foreground uppercase mt-2.5">{dict.common.total}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="font-pixel text-sm uppercase">{dict.profile.sections.stats.winRate}</CardTitle>
                  <Trophy className="text-game-orange h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="font-pixel text-2xl">{user.stats.winRate}</div>
                  <p className="font-pixel text-xs text-muted-foreground uppercase mt-2.5">{dict.games.pong.title}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="font-pixel text-sm uppercase">
                    {dict.profile.sections.stats.bestScore}
                  </CardTitle>
                  <BarChart3 className="text-game-red h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="font-pixel text-2xl">{user.stats.highScore}</div>
                  <p className="font-pixel text-xs text-muted-foreground uppercase mt-2.5">{dict.games.dino.title}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* History Tab - Using Dashboard's History Section Style */}
          <TabsContent value="history" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="font-pixel text-sm">PONG MATCH HISTORY</CardTitle>
                  <CardDescription className="font-pixel text-xs">YOUR RECENT PONG GAMES</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 pr-2">
                    {pongHistory.map((game, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-2 bg-muted rounded-md cursor-pointer hover:bg-muted/80 transition-colors"
                        onClick={() => handleMatchClick("pong", game)}
                      >
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              game.result === "WIN" ? "bg-game-green" : "bg-game-red"
                            }`}
                          ></div>
                          <p className="font-pixel text-xs">
                            {game.players.length} PLAYERS • {game.date}
                          </p>
                        </div>
                        <div>
                          <p
                            className={`font-pixel text-xs ${
                              game.result === "WIN" ? "text-game-green" : "text-game-red"
                            }`}
                          >
                            {game.result}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-pixel text-sm">DINO RUN HISTORY</CardTitle>
                  <CardDescription className="font-pixel text-xs">YOUR RECENT DINO RUN ATTEMPTS</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 pr-2 min-h-[320px]">
                    {dinoHistory.map((game, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-2 bg-muted rounded-md cursor-pointer hover:bg-muted/80 transition-colors"
                        onClick={() => handleMatchClick("dino", game)}
                      >
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              game.result === "WIN" ? "bg-game-green" : "bg-game-red"
                            }`}
                          ></div>
                          <p className="font-pixel text-xs">
                            {game.players.length} PLAYERS • {game.date}
                          </p>
                        </div>
                        <div>
                          <p
                            className={`font-pixel text-xs ${
                              game.result === "WIN" ? "text-game-green" : "text-game-red"
                            }`}
                          >
                            {game.result}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Match Details Dialog - From Dashboard */}
      <MatchDetailsDialog open={dialogOpen} onOpenChange={setDialogOpen} match={selectedMatch} />
    </div>
  )
}
