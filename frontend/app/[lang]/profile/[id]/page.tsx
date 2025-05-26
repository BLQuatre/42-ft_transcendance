"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { MainNav } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Button } from "@/components/ui/Button"
import { UserPlus, MessageSquare, Trophy, GamepadIcon, BarChart3, Clock, UserX, UserCheck } from "lucide-react"
import { useToast } from "@/hooks/UseToast"
import { ToastVariant } from "@/types/types"
import Link from "next/link"
import { MatchDetailsDialog } from "@/components/dialog/MatchDetailsDialog"
import { useDictionary } from "@/hooks/UseDictionnary"
import Loading from "@/components/Loading"
import { Line, LineChart, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import api from "@/lib/api"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/Chart"
import { FriendRequest, FriendRequestStatus } from "@/types/friend"

export default function UserProfilePage() {
  const params = useParams()
  const userId = params.id as string
  const currentUserId = typeof window !== 'undefined' ? localStorage.getItem("userId") : null
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Friend-related state
  const [friendStatus, setFriendStatus] = useState<FriendRequestStatus | null>(null)
  const [friends, setFriends] = useState<FriendRequest[]>([])
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])
  const [blockedUsers, setBlockedUsers] = useState<FriendRequest[]>([])
  const [isOwnProfile, setIsOwnProfile] = useState(false)

  const { toast } = useToast()
  const [gameHistory, setGameHistory] = useState<{
    pong: any[];
    dino: any[];
  }>({
    pong: [],
    dino: []
  })
  const [gameStats, setGameStats] = useState<{
    gamePlayData: any[];
    scoreData: any[];
  }>({
    gamePlayData: [],
    scoreData: []
  })

  // Add stats state similar to dashboard
  const [stats, setStats] = useState({
    total_games_played: 0,
    pong_win_rate: 0,
    best_dino_score: 0
  })

  const [selectedMatch, setSelectedMatch] = useState<null | {
    type: "pong" | "dino"
    details: any
  }>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleMatchClick = (type: "pong" | "dino", details: any) => {
    setSelectedMatch({ type, details })
    setDialogOpen(true)
  }

  // Helper function to get friend status
  const getFriendStatus = (targetUserId: string): FriendRequestStatus | null => {
    // Check if user is blocked
    const blocked = blockedUsers.find((blocked) =>
      blocked.receiver_id === targetUserId || blocked.sender_id === targetUserId
    )
    if (blocked) return FriendRequestStatus.BLOCKED

    // Check if users are friends
    const friend = friends.find((friend) =>
      friend.sender_id === targetUserId || friend.receiver_id === targetUserId
    )
    if (friend) return FriendRequestStatus.ACCEPTED

    // Check if there's a pending request
    const pending = friendRequests.find((request) =>
      request.sender_id === targetUserId || request.receiver_id === targetUserId
    )
    if (pending) return FriendRequestStatus.PENDING

    return null
  }

  // Update friend data from API
  const updateFriendData = async () => {
    try {
      const [friendsRes, requestsRes, blockedRes] = await Promise.all([
        api.get("/friend").catch(() => ({ data: { friends: [] } })),
        api.get("/friend/pending").catch(() => ({ data: { friends: [] } })),
        api.get("/friend/blocked").catch(() => ({ data: { friends: [] } }))
      ])

      setFriends(friendsRes.data?.friends || [])
      setFriendRequests(requestsRes.data?.friends || [])
      setBlockedUsers(blockedRes.data?.friends || [])
    } catch (error) {
      console.error("Error updating friend data:", error)
    }
  }

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true)

        // Check if viewing own profile
        setIsOwnProfile(userId === currentUserId)

        // Fetch user profile data
        const userResponse = await api.get(`/user/${userId}`)
        setUser(userResponse.data.user || userResponse.data)

        // Update friend data if not viewing own profile
        if (userId !== currentUserId) {
          await updateFriendData()
        }

        // Fetch game history
        const historyResponse = await api.get(`/history/${userId}`)
        if (historyResponse.data && historyResponse.data.history) {
          const pongGames = historyResponse.data.history.filter(
            (game: any) => game.gameSession?.game_type === "PONG"
          )

          const dinoGames = historyResponse.data.history.filter(
            (game: any) => game.gameSession?.game_type === "DINO"
          )

          setGameHistory({
            pong: pongGames || [],
            dino: dinoGames || []
          })

          // Process chart data from history
          const activityData = processGameActivityData(historyResponse.data.history || [])
          const scoreData = processScoreData(historyResponse.data.history || [])

          setGameStats({
            gamePlayData: activityData,
            scoreData: scoreData
          })
        }

        // Fetch user stats (same as dashboard)
        const statsResponse = await api.get(`/history/stats/${userId}`)
        if (statsResponse.data && statsResponse.data.statusCode === 200) {
          setStats({
            total_games_played: statsResponse.data.total_games_played || 0,
            pong_win_rate: statsResponse.data.pong_win_rate || 0,
            best_dino_score: statsResponse.data.best_dino_score || 0
          })
        }

        setLoading(false)
      } catch (err) {
        console.error("Error fetching user profile:", err)
        setError("Failed to load user profile")
        setLoading(false)
      }
    }

    if (userId) {
      fetchUserProfile()
    }
  }, [userId])

  // Update friend status when friend data changes
  useEffect(() => {
    if (userId && !isOwnProfile) {
      setFriendStatus(getFriendStatus(userId))
    }
  }, [userId, friends, friendRequests, blockedUsers, isOwnProfile])

  // Process game history data for charts (same as dashboard)
  const processGameActivityData = (allHistory: any[]) => {
    if (!allHistory.length) {
      return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
        name: day,
        pong: 0,
        dino: 0
      }));
    }

    const gamesByDay = new Map();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    last7Days.forEach(day => {
      const dayName = new Date(day).toLocaleDateString('en-US', { weekday: 'short' });
      gamesByDay.set(day, { name: dayName, pong: 0, dino: 0 });
    });

    allHistory.forEach(game => {
      const gameDate = new Date(game.gameSession.created_at).toISOString().split('T')[0];
      if (gamesByDay.has(gameDate)) {
        const dayData = gamesByDay.get(gameDate);
        if (game.gameSession.game_type === "PONG") {
          dayData.pong += 1;
        } else if (game.gameSession.game_type === "DINO") {
          dayData.dino += 1;
        }
        gamesByDay.set(gameDate, dayData);
      }
    });

    return Array.from(gamesByDay.values());
  };

  const processScoreData = (allHistory: any[]) => {
    if (!allHistory.length) {
      return [
        { name: 'Week 1', score: 0 },
        { name: 'Week 2', score: 0 },
        { name: 'Week 3', score: 0 },
        { name: 'Week 4', score: 0 }
      ];
    }

    const scoreByWeek = new Map();
    const currentDate = new Date();

    allHistory.forEach(game => {
      const gameDate = new Date(game.gameSession.created_at);
      const weekDiff = Math.floor((currentDate.getTime() - gameDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
      const weekKey = `Week ${weekDiff + 1}`;

      if (!scoreByWeek.has(weekKey)) {
        scoreByWeek.set(weekKey, { scores: [], name: weekKey });
      }

      const weekData = scoreByWeek.get(weekKey);
      weekData.scores.push(game.score);
      scoreByWeek.set(weekKey, weekData);
    });

    const scoreProgression = Array.from(scoreByWeek.entries())
      .map(([week, data]) => ({
        name: week,
        score: Math.round(data.scores.reduce((sum: number, score: number) => sum + score, 0) / data.scores.length)
      }))
      .sort((a, b) => {
        const weekA = parseInt(a.name.split(' ')[1]);
        const weekB = parseInt(b.name.split(' ')[1]);
        return weekA - weekB;
      });

    return scoreProgression.length ? scoreProgression : [{ name: 'Week 1', score: 0 }];
  };

  const handleAddFriend = async () => {
    if (!dict || isOwnProfile) return

    try {
      await api.post(`/friend/${userId}`)
      await updateFriendData()

      // Dispatch event to reload chat friends list
      window.dispatchEvent(new CustomEvent('friendStatusChanged'))

      toast({
        title: dict.friends.notifications.requestSent.title,
        description: dict.friends.notifications.requestSent.description.replace('%user%', user?.name || user?.username || userId),
        variant: ToastVariant.SUCCESS,
        duration: 3000,
      })
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast({
          title: dict.friends.notifications.requestAlreadySent.title,
          description: dict.friends.notifications.requestAlreadySent.description.replace('%user%', user?.name || user?.username || userId),
          variant: ToastVariant.WARNING,
          duration: 3000,
        })
      } else {
        toast({
          title: dict.friends.notifications.error.title,
          description: dict.friends.notifications.error.description.replace('%user%', user?.name || user?.username || userId),
          variant: ToastVariant.ERROR,
          duration: 3000,
        })
      }
    }
  }

  const handleMessage = async () => {
    if (!user) return

    // Trigger the chat to open with this user
    // The SimpleChat component should handle opening a private chat
    // We can dispatch a custom event or use a global state management
    const chatEvent = new CustomEvent('openPrivateChat', {
      detail: {
        id: userId,
        name: user.displayName || user.username || user.name,
        avatar: user.avatar || "/placeholder.svg",
        status: 'online' // Default status
      }
    })

    window.dispatchEvent(chatEvent)
  }

  const handleUnblockUser = async () => {
    if (!dict || isOwnProfile) return

    try {
      await api.delete(`/friend/${userId}`)
      await updateFriendData()

      // Dispatch event to reload chat friends list
      window.dispatchEvent(new CustomEvent('friendStatusChanged'))

      toast({
        title: dict.friends.notifications.userUnblocked.title,
        description: dict.friends.notifications.userUnblocked.description.replace('%user%', user?.name || user?.username || userId),
        variant: ToastVariant.SUCCESS,
        duration: 3000,
      })
    } catch (error: any) {
      toast({
        title: dict.friends.notifications.error.title,
        description: dict.friends.notifications.error.description.replace('%user%', user?.name || user?.username || userId),
        variant: ToastVariant.ERROR,
        duration: 3000,
      })
    }
  }

  const dict = useDictionary()
  if (!dict) return null

  if (loading) {
    return <Loading dict={dict} />
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <MainNav />
        <div className="flex-1 container py-8 px-4 md:px-6 flex flex-col items-center justify-center">
          <h1 className="font-pixel text-2xl mb-4 uppercase">{dict.profile.notFound.replace("%user%", userId)}</h1>
          <Button asChild className="font-pixel bg-game-blue hover:bg-game-blue/90">
            <Link href="/" className="uppercase">
              {dict.common.back}
            </Link>
          </Button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainNav />

      <div className="flex-1 container py-16 px-4 md:px-6">
        <div className="mb-8 bg-card rounded-lg p-6 pixel-border">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="relative">
              <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-game-blue">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username || user.name} />
                <AvatarFallback className="font-pixel text-xl">{(user.username || user.name || "??").substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1 text-center md:text-left flex flex-col justify-center align-middle">
              <h1 className="font-pixel text-2xl md:text-3xl">{user.displayName || user.username || user.name}</h1>
            </div>

            <div className="flex flex-col gap-2 mt-4 md:mt-0">
              {!isOwnProfile && (
                <>
                  {friendStatus === FriendRequestStatus.ACCEPTED ? (
                    <Button className="font-pixel bg-game-green hover:bg-game-green/90 uppercase" onClick={handleMessage}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      {dict.profile.sendMessage}
                    </Button>
                  ) : friendStatus === FriendRequestStatus.PENDING ? (
                    <Button disabled className="font-pixel bg-yellow-500 hover:bg-yellow-500/90 uppercase">
                      <Clock className="h-4 w-4 mr-2" />
                      {dict.friends?.pendingRequest || "Request Pending"}
                    </Button>
                  ) : friendStatus === FriendRequestStatus.BLOCKED ? (
                    <Button className="font-pixel bg-green-500 hover:bg-green-600 uppercase" onClick={handleUnblockUser}>
                      <UserCheck className="h-4 w-4 mr-2" />
                      {dict.friends?.actions?.unblockUser || "Unblock User"}
                    </Button>
                  ) : (
                    <Button className="font-pixel bg-game-blue hover:bg-game-blue/90 uppercase" onClick={handleAddFriend}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      {dict.profile.addFriend}
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="font-pixel text-xs overflow-x-auto w-full flex-nowrap">
            <TabsTrigger className="uppercase" value="overview">
              {dict.profile.sections.overview.title}
            </TabsTrigger>
            <TabsTrigger className="uppercase" value="history">
              {dict.profile.sections.history.title}
            </TabsTrigger>
          </TabsList>

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
                  <div className="font-pixel text-2xl">{stats.total_games_played}</div>
                  <p className="font-pixel text-xs text-muted-foreground uppercase mt-2.5">{dict.common.total}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="font-pixel text-sm uppercase">{dict.profile.sections.stats.winRate}</CardTitle>
                  <Trophy className="text-game-orange h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="font-pixel text-2xl">{Math.floor(stats.pong_win_rate)}%</div>
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
                  <div className="font-pixel text-2xl">{stats.best_dino_score}</div>
                  <p className="font-pixel text-xs text-muted-foreground uppercase mt-2.5">{dict.games.dino.title}</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="font-pixel text-sm uppercase">
                    {dict.profile.sections.charts.activity.title}
                  </CardTitle>
                  <CardDescription className="font-pixel text-xs uppercase">
                    {dict.profile.sections.charts.activity.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ChartContainer
                    config={{
                      pong: {
                        label: "PONG",
                        color: "hsl(var(--chart-1))",
                      },
                      dino: {
                        label: "DINO RUN",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={gameStats.gamePlayData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="pong" fill="var(--color-primary)" name="PONG" />
                        <Bar dataKey="dino" fill="var(--color-secondary)" name="DINO RUN" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-pixel text-sm uppercase">
                    {dict.profile.sections.charts.score.title}
                  </CardTitle>
                  <CardDescription className="font-pixel text-xs uppercase">
                    {dict.profile.sections.charts.score.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ChartContainer
                    config={{
                      score: {
                        label: dict.profile.sections.charts.score.label,
                        color: "hsl(var(--chart-3))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={gameStats.scoreData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="score"
                          stroke="var(--color-score)"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                          name={dict.profile.sections.charts.score.label}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="font-pixel text-sm">{dict.profile.sections.history.pong.title}</CardTitle>
                  <CardDescription className="font-pixel text-xs">{dict.profile.sections.history.pong.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 h-[480px] overflow-y-auto pr-2 show-scrollbar">
                    {gameHistory.pong.length > 0 ? (
                      gameHistory.pong.map((gameResult, index) => {
                        const isWinner = gameResult.is_winner || false
                        const result = isWinner ? dict.profile.sections.history.win : dict.profile.sections.history.lose
                        const gameSession = gameResult.gameSession
                        const playerCount = gameSession?.results?.length || 0
                        const gameDate = new Date(gameSession?.created_at || Date.now()).toLocaleDateString()

                        return (
                          <div
                            key={index}
                            className="flex justify-between items-center p-2 bg-muted rounded-md cursor-pointer hover:bg-muted/80 transition-colors"
                            onClick={() => handleMatchClick("pong", gameSession)}
                          >
                            <div className="flex items-center space-x-2">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  isWinner ? "bg-game-green" : "bg-game-red"
                                }`}
                              ></div>
                              <p className="font-pixel text-xs">
                                {playerCount} {dict.dashboard.sections.history.players} • {gameDate}
                              </p>
                            </div>
                            <div>
                              <p
                                className={`font-pixel text-xs ${
                                  isWinner ? "text-game-green" : "text-game-red"
                                }`}
                              >
                                {result}
                              </p>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="flex items-center justify-center h-64">
                        <p className="font-pixel text-sm text-muted-foreground">{dict.profile.sections.history.noGames}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-pixel text-sm">{dict.profile.sections.history.dino.title}</CardTitle>
                  <CardDescription className="font-pixel text-xs">{dict.profile.sections.history.dino.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 h-[480px] overflow-y-auto pr-2 show-scrollbar">
                    {gameHistory.dino.length > 0 ? (
                      gameHistory.dino.map((gameResult, index) => {
                        const isWinner = gameResult.is_winner || false
                        const result = isWinner ? "WIN" : "LOOSE"
                        const gameSession = gameResult.gameSession
                        const playerCount = gameSession?.results?.length || 0
                        const gameDate = new Date(gameSession?.created_at || Date.now()).toLocaleDateString()

                        return (
                          <div
                            key={index}
                            className="flex justify-between items-center p-2 bg-muted rounded-md cursor-pointer hover:bg-muted/80 transition-colors"
                            onClick={() => handleMatchClick("dino", gameSession)}
                          >
                            <div className="flex items-center space-x-2">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  isWinner ? "bg-game-green" : "bg-game-red"
                                }`}
                              ></div>
                              <p className="font-pixel text-xs">
                                {playerCount} PLAYERS • {gameDate}
                              </p>
                            </div>
                            <div>
                              <p
                                className={`font-pixel text-xs ${
                                  isWinner ? "text-game-green" : "text-game-red"
                                }`}
                              >
                                {result}
                              </p>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="flex items-center justify-center h-64">
                        <p className="font-pixel text-sm text-muted-foreground">{dict.profile.sections.history.noGames}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <MatchDetailsDialog open={dialogOpen} onOpenChange={setDialogOpen} match={selectedMatch} />
    </div>
  )
}
