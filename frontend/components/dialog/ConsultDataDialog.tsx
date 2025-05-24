"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/Dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { ScrollArea } from "@/components/ui/ScrollArea"
import { Badge } from "@/components/ui/Badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Separator } from "@/components/ui/Separator"
import { Button } from "@/components/ui/Button"
import { User, Gamepad2, Trophy, Target, Download, Calendar, Clock, Shield } from "lucide-react"
import type { BaseUser } from "@/types/user"

type Player = {
  id: string
  user_id: string | null
  username: string
  is_bot: boolean
  avatar?: string
}

type GameResult = {
  id: string
  score: number
  is_winner: boolean
  player: Player
}

type GameSession = {
  id: string
  game_type: "PONG" | "DINO"
  created_at: string
  results: GameResult[]
}

type GameHistoryItem = {
  id: string
  score: number
  is_winner: boolean
  player: Player
  gameSession: GameSession
}

interface ConsultDataDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user:
    | (BaseUser & {
        created_at?: string
        updated_at?: string
        isTfaEnabled?: boolean
      })
    | null
  stats: {
    total_games_played: number
    pong_win_rate: number
    best_dino_score: number
  }
  pongGameHistory: GameHistoryItem[]
  dinoGameHistory: GameHistoryItem[]
}

export function ConsultDataDialog({
  open,
  onOpenChange,
  user,
  stats,
  pongGameHistory,
  dinoGameHistory,
}: ConsultDataDialogProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const totalGames = pongGameHistory.length + dinoGameHistory.length
  const totalWins = [...pongGameHistory, ...dinoGameHistory].filter((game) => game.is_winner).length
  const overallWinRate = totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0

  const downloadRawData = () => {
    const dataToExport = {
      user: user,
      statistics: stats,
      gameHistory: {
        pong: pongGameHistory,
        dino: dinoGameHistory,
        total: pongGameHistory.length + dinoGameHistory.length,
      },
      summary: {
        totalGames,
        totalWins,
        overallWinRate,
        accountAge: user?.created_at
          ? Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24))
          : 0,
      },
      dataExportedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `user-data-${user?.name || "unknown"}-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`w-full max-w-5xl h-[80vh] max-h-[1000px] overflow-hidden`}>
        <DialogHeader className="pb-2 border-b">
          <DialogTitle className="font-pixel text-xl uppercase flex items-center gap-3">
            <div className="p-2 bg-game-blue/10 rounded-lg">
              <User className="h-6 w-6 text-game-blue" />
            </div>
            Your Data Overview
          </DialogTitle>
          <DialogDescription className="font-pixel text-sm uppercase text-muted-foreground">
            Complete overview of your account data and gaming activity
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="flex-1 flex flex-col h-full">
          <TabsList className="grid w-full grid-cols-4 font-pixel text-xs mb-2">
            <TabsTrigger value="profile" className="uppercase">
              Profile
            </TabsTrigger>
            <TabsTrigger value="statistics" className="uppercase">
              Statistics
            </TabsTrigger>
            <TabsTrigger value="games" className="uppercase">
              Game History
            </TabsTrigger>
            <TabsTrigger value="raw" className="uppercase">
              Raw Data
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="profile" className="h-full">
              <ScrollArea className="h-full pr-4">
                <div className="space-y-6">
                  <Card className="border-2 border-game-blue/20">
                    <CardHeader className="pb-4">
                      <CardTitle className="font-pixel text-lg uppercase flex items-center gap-2">
                        <User className="h-5 w-5 text-game-blue" />
                        Profile Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center gap-6">
                        <Avatar className="h-20 w-20 border-4 border-game-blue/30">
                          <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "User"} />
                          <AvatarFallback className="font-pixel text-xl bg-game-blue/10">
                            {(user?.name || "U").substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                          <h3 className="font-pixel text-2xl text-game-blue">{user?.name || "Unknown User"}</h3>
                          <p className="font-pixel text-sm text-muted-foreground">ID: {user?.id || "N/A"}</p>
                          <div className="flex gap-2">
                            {user?.isTfaEnabled && (
                              <Badge variant="default" className="font-pixel text-xs bg-game-green">
                                <Shield className="h-3 w-3 mr-1" />
                                2FA Enabled
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-game-blue" />
                            <p className="font-pixel text-sm text-muted-foreground uppercase">Account Created</p>
                          </div>
                          <p className="font-pixel text-lg">
                            {user?.created_at ? formatDate(user.created_at) : "Unknown"}
                          </p>
                          {user && (
                            <p className="font-pixel text-xs text-muted-foreground">
                              {user.created_at
                                ? `${Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24))} days ago`
                                : "No creation date available"}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-game-orange" />
                            <p className="font-pixel text-sm text-muted-foreground uppercase">Last Updated</p>
                          </div>
                          <p className="font-pixel text-lg">
                            {user?.updated_at ? formatDate(user.updated_at) : "Unknown"}
                          </p>
                          {user && (
                            <p className="font-pixel text-xs text-muted-foreground">
                              {user.updated_at
                                ? `${Math.floor((Date.now() - new Date(user.updated_at).getTime()) / (1000 * 60 * 60 * 24))} days ago`
                                : "No update date available"}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="statistics" className="h-full">
              <ScrollArea className="h-full pr-4">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="border-2 border-game-red/20">
                      <CardHeader className="pb-3">
                        <CardTitle className="font-pixel text-xs uppercase flex items-center gap-2">
                          <Gamepad2 className="h-4 w-4 text-game-red" />
                          Total Games
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="font-pixel text-3xl text-game-red">{stats.total_games_played}</p>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-game-green/20">
                      <CardHeader className="pb-3">
                        <CardTitle className="font-pixel text-xs uppercase flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-game-green" />
                          Win Rate
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="font-pixel text-3xl text-game-green">{overallWinRate}%</p>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-game-orange/20">
                      <CardHeader className="pb-3">
                        <CardTitle className="font-pixel text-xs uppercase flex items-center gap-2">
                          <Target className="h-4 w-4 text-game-orange" />
                          Pong Win Rate
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="font-pixel text-3xl text-game-orange">{Math.floor(stats.pong_win_rate)}%</p>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-game-blue/20">
                      <CardHeader className="pb-3">
                        <CardTitle className="font-pixel text-xs uppercase flex items-center gap-2">
                          <Target className="h-4 w-4 text-game-blue" />
                          Best Dino Score
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="font-pixel text-3xl text-game-blue">{stats.best_dino_score}</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-2 border-game-blue/20">
                      <CardHeader>
                        <CardTitle className="font-pixel text-lg uppercase text-game-blue">Pong Games</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                          <span className="font-pixel text-sm">Total Played:</span>
                          <span className="font-pixel text-lg font-bold">{pongGameHistory.length}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-game-green/10 rounded-lg">
                          <span className="font-pixel text-sm">Wins:</span>
                          <span className="font-pixel text-lg font-bold text-game-green">
                            {pongGameHistory.filter((game) => game.is_winner).length}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-game-red/10 rounded-lg">
                          <span className="font-pixel text-sm">Losses:</span>
                          <span className="font-pixel text-lg font-bold text-game-red">
                            {pongGameHistory.filter((game) => !game.is_winner).length}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-game-orange/20">
                      <CardHeader>
                        <CardTitle className="font-pixel text-lg uppercase text-game-orange">Dino Games</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                          <span className="font-pixel text-sm">Total Played:</span>
                          <span className="font-pixel text-lg font-bold">{dinoGameHistory.length}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-game-green/10 rounded-lg">
                          <span className="font-pixel text-sm">Wins:</span>
                          <span className="font-pixel text-lg font-bold text-game-green">
                            {dinoGameHistory.filter((game) => game.is_winner).length}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-game-blue/10 rounded-lg">
                          <span className="font-pixel text-sm">Average Score:</span>
                          <span className="font-pixel text-lg font-bold text-game-blue">
                            {dinoGameHistory.length > 0
                              ? Math.round(
                                  dinoGameHistory.reduce((sum, game) => sum + game.score, 0) / dinoGameHistory.length,
                                )
                              : 0}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="games" className="h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                <Card className="border-2 border-game-blue/20">
                  <CardHeader>
                    <CardTitle className="font-pixel text-lg uppercase text-game-blue">Recent Pong Games</CardTitle>
                    <CardDescription className="font-pixel text-xs">Last 10 matches</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[350px]">
                      <div className="space-y-3">
                        {pongGameHistory.slice(0, 10).map((game, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-3 bg-muted/30 rounded-lg border border-muted"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-3 h-3 rounded-full ${game.is_winner ? "bg-game-green" : "bg-game-red"}`}
                              />
                              <div>
                                <span className="font-pixel text-sm">{formatDate(game.gameSession.created_at)}</span>
                                <p className="font-pixel text-xs text-muted-foreground">Score: {game.score}</p>
                              </div>
                            </div>
                            <Badge variant={game.is_winner ? "default" : "destructive"} className="font-pixel text-xs">
                              {game.is_winner ? "WIN" : "LOSS"}
                            </Badge>
                          </div>
                        ))}
                        {pongGameHistory.length === 0 && (
                          <p className="font-pixel text-sm text-center py-8 text-muted-foreground">
                            No Pong games found
                          </p>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                <Card className="border-2 border-game-orange/20">
                  <CardHeader>
                    <CardTitle className="font-pixel text-lg uppercase text-game-orange">Recent Dino Games</CardTitle>
                    <CardDescription className="font-pixel text-xs">Last 10 attempts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[350px]">
                      <div className="space-y-3">
                        {dinoGameHistory.slice(0, 10).map((game, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-3 bg-muted/30 rounded-lg border border-muted"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-3 h-3 rounded-full ${game.is_winner ? "bg-game-green" : "bg-game-red"}`}
                              />
                              <div>
                                <span className="font-pixel text-sm">{formatDate(game.gameSession.created_at)}</span>
                                <p className="font-pixel text-xs text-muted-foreground">Score: {game.score}</p>
                              </div>
                            </div>
                            <Badge variant={game.is_winner ? "default" : "destructive"} className="font-pixel text-xs">
                              {game.is_winner ? "WIN" : "LOSS"}
                            </Badge>
                          </div>
                        ))}
                        {dinoGameHistory.length === 0 && (
                          <p className="font-pixel text-sm text-center py-8 text-muted-foreground">
                            No Dino games found
                          </p>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="raw" className="h-full">
              <Card className="h-full border-2 border-muted">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="font-pixel text-lg uppercase">Raw User Data</CardTitle>
                    <CardDescription className="font-pixel text-sm">
                      Technical data stored about your account
                    </CardDescription>
                  </div>
                  <Button
                    onClick={downloadRawData}
                    variant="outline"
                    size="sm"
                    className="font-pixel text-xs uppercase gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download Full JSON
                  </Button>
                </CardHeader>
                <CardContent className="h-[calc(100%-120px)]">
                  <ScrollArea className="h-full">
                    <div className="space-y-4">
                      <div className="p-4 bg-muted/50 rounded-lg border">
                        <h4 className="font-pixel text-sm uppercase mb-2 text-game-blue">User Information</h4>
                        <pre className="font-mono text-xs overflow-x-auto">
                          {JSON.stringify(
                            {
                              id: user?.id,
                              name: user?.name,
                              created_at: user?.created_at,
                              updated_at: user?.updated_at,
                              isTfaEnabled: user?.isTfaEnabled,
                            },
                            null,
                            2,
                          )}
                        </pre>
                      </div>

                      <div className="p-4 bg-muted/50 rounded-lg border">
                        <h4 className="font-pixel text-sm uppercase mb-2 text-game-green">Statistics Summary</h4>
                        <pre className="font-mono text-xs overflow-x-auto">
                          {JSON.stringify(
                            {
                              ...stats,
                              totalGames,
                              totalWins,
                              overallWinRate,
                            },
                            null,
                            2,
                          )}
                        </pre>
                      </div>

                      <div className="p-4 bg-muted/50 rounded-lg border">
                        <h4 className="font-pixel text-sm uppercase mb-2 text-game-orange">Game History Summary</h4>
                        <pre className="font-mono text-xs overflow-x-auto">
                          {JSON.stringify(
                            {
                              pongGames: pongGameHistory.length,
                              dinoGames: dinoGameHistory.length,
                              totalGames: pongGameHistory.length + dinoGameHistory.length,
                              recentPongGames: pongGameHistory.slice(0, 3).map((game) => ({
                                date: game.gameSession.created_at,
                                score: game.score,
                                won: game.is_winner,
                              })),
                              recentDinoGames: dinoGameHistory.slice(0, 3).map((game) => ({
                                date: game.gameSession.created_at,
                                score: game.score,
                                won: game.is_winner,
                              })),
                            },
                            null,
                            2,
                          )}
                        </pre>
                      </div>

                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="font-pixel text-xs text-yellow-800">
                          💡 This shows a summary of your data. Click "Download Full JSON" above to get the complete
                          dataset.
                        </p>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
