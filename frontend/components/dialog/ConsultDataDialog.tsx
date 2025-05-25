"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/Dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { Badge } from "@/components/ui/Badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Separator } from "@/components/ui/Separator"
import { Button } from "@/components/ui/Button"
import { User, Download, Calendar, Clock, Shield } from "lucide-react"
import type { BaseUser } from "@/types/user"
import { useDictionary } from "@/hooks/UseDictionnary"


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
        tfaEnable?: boolean
        email?: string
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

	const dict = useDictionary()
	if (!dict) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-6xl max-h-[1200px] overflow-hidden`}>
        <DialogHeader className="pb-2 border-b">
          <DialogTitle className="font-pixel text-xl flex items-center gap-3 uppercase">
            <div className="p-2 bg-game-blue/10 rounded-lg">
              <User className="h-6 w-6 text-game-blue" />
            </div>
            {dict.dialogs.consultData.title}
          </DialogTitle>
          <DialogDescription className="font-pixel text-sm uppercase text-muted-foreground">
            {dict.dialogs.consultData.description}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="flex-1 flex flex-col h-full">
          <TabsList className="grid w-full grid-cols-2 font-pixel text-xs mb-2">
            <TabsTrigger value="profile" className="uppercase">
              {dict.dialogs.consultData.profile.title}
            </TabsTrigger>
            <TabsTrigger value="raw" className="uppercase">
              {dict.dialogs.consultData.rawData.title}
            </TabsTrigger>
          </TabsList>

          <div className="flex-1">
            <TabsContent value="profile" className="h-full">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6 h-full">
                <div className="space-y-6">
                  <Card className="h-full border-2 border-muted">
                    <CardHeader className="pb-4">
                      <CardTitle className="font-pixel text-lg uppercase flex items-center gap-2">
                        <User className="h-5 w-5 text-game-blue" />
                        {dict.dialogs.consultData.profile.description}
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
                          <p className="font-pixel text-sm text-muted-foreground">Email: {user?.email || "N/A"}</p>
                          <div className="flex gap-2">
                            {user?.tfaEnable && (
                              <Badge variant="default" className="font-pixel text-xs bg-game-green">
                                <Shield className="h-3 w-3 mr-1" />
                                {dict.dialogs.consultData.profile.tfaEnabled}
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
                            <p className="font-pixel text-sm text-muted-foreground uppercase">{dict.dialogs.consultData.profile.accountCreated}</p>
                          </div>
                          <p className="font-pixel text-lg">
                            {user?.created_at ? formatDate(user.created_at) : dict.dialogs.consultData.profile.unknown}
                          </p>
                          {user && (
                            <p className="font-pixel text-xs text-muted-foreground">
                              {user.created_at
                                ? `${Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24))} days ago`
                                : dict.dialogs.consultData.profile.noCreationDate}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-game-orange" />
                            <p className="font-pixel text-sm text-muted-foreground uppercase">{dict.dialogs.consultData.profile.accountUpdated}</p>
                          </div>
                          <p className="font-pixel text-lg">
                            {user?.updated_at ? formatDate(user.updated_at) : dict.dialogs.consultData.profile.unknown}
                          </p>
                          {user && (
                            <p className="font-pixel text-xs text-muted-foreground">
                              {user.updated_at
                                ? `${Math.floor((Date.now() - new Date(user.updated_at).getTime()) / (1000 * 60 * 60 * 24))} days ago`
                                : dict.dialogs.consultData.profile.noUpdateDate}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="raw" className="h-full">
              <Card className="h-full border-2 border-muted">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="font-pixel text-lg uppercase">{dict.dialogs.consultData.rawData.title}</CardTitle>
                    <CardDescription className="font-pixel text-sm">
                      {dict.dialogs.consultData.rawData.description}
                    </CardDescription>
                  </div>
                  <Button
                    onClick={downloadRawData}
                    variant="outline"
                    size="sm"
                    className="font-pixel text-xs uppercase gap-2"
                  >
                    <Download className="h-4 w-4" />
                    {dict.dialogs.consultData.rawData.download}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="h-full overflow-y-auto pr-2">
                    <div className="space-y-4">
                      <div className="p-4 bg-muted/50 rounded-lg border">
                        <h4 className="font-pixel text-sm uppercase mb-2 text-game-blue">{dict.dialogs.consultData.rawData.userInfo}</h4>
                        <pre className="font-mono text-xs overflow-x-auto">
                          {JSON.stringify(
                            {
                              id: user?.id,
                              name: user?.name,
                              email: user?.email,
                              created_at: user?.created_at,
                              updated_at: user?.updated_at,
                              isTfaEnabled: user?.tfaEnable,
                            },
                            null,
                            2,
                          )}
                        </pre>
                      </div>

                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="font-pixel text-xs text-yellow-800">
							{dict.dialogs.consultData.rawData.summary}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
