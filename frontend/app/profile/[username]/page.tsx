"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UserPlus, MessageSquare, Trophy, GamepadIcon, Clock, BarChart3 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Sample user data - in a real app, this would come from an API
const userData = {
  GAMER42: {
    username: "GAMER42",
    displayName: "The Gamer",
    avatar: "/placeholder.svg?height=100&width=100",
    level: 24,
    joinDate: "04/12/2022",
    bio: "Retro gaming enthusiast. Pong champion and pixel art lover.",
    stats: {
      totalGames: 342,
      winRate: "68%",
      highScore: 1876,
      playtime: "124h",
      achievements: 18,
      rank: "#42",
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
    recentGames: [
      { game: "Pong", opponent: "PIXEL_MASTER", result: "WIN", score: "10-5", date: "04/20/2023" },
      { game: "Dino", score: 1542, date: "04/18/2023" },
      { game: "Pong", opponent: "RETRO_FAN", result: "LOSS", score: "7-10", date: "04/15/2023" },
      { game: "Dino", score: 1245, date: "04/12/2023" },
      { game: "Pong", opponent: "ARCADE_PRO", result: "WIN", score: "10-2", date: "04/10/2023" },
    ],
    achievements: [
      {
        id: "a1",
        name: "FIRST VICTORY",
        description: "Win your first game",
        icon: "trophy",
        date: "04/15/2022",
        rarity: "common",
      },
      {
        id: "a2",
        name: "CHAMPION",
        description: "Win 10 games in a row",
        icon: "medal",
        date: "06/22/2022",
        rarity: "rare",
      },
      {
        id: "a3",
        name: "ON FIRE",
        description: "Score 500+ points in Dino Run",
        icon: "flame",
        date: "08/03/2022",
        rarity: "uncommon",
      },
      {
        id: "a4",
        name: "PONG MASTER",
        description: "Win 50 Pong games",
        icon: "award",
        date: "09/15/2022",
        rarity: "epic",
      },
    ],
  },
  PIXEL_MASTER: {
    username: "PIXEL_MASTER",
    displayName: "Pixel Master",
    avatar: "/placeholder.svg?height=100&width=100",
    level: 36,
    joinDate: "02/28/2022",
    bio: "Pixel art creator and retro game developer. I love creating and playing 8-bit style games!",
    stats: {
      totalGames: 512,
      winRate: "74%",
      highScore: 2048,
      playtime: "256h",
      achievements: 24,
      rank: "#12",
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
    recentGames: [
      { game: "Dino", score: 1876, date: "05/01/2023" },
      { game: "Pong", opponent: "GAMER42", result: "WIN", score: "10-8", date: "04/28/2023" },
      { game: "Pong", opponent: "RETRO_FAN", result: "WIN", score: "10-6", date: "04/25/2023" },
      { game: "Dino", score: 1654, date: "04/22/2023" },
      { game: "Pong", opponent: "ARCADE_PRO", result: "WIN", score: "10-4", date: "04/20/2023" },
    ],
    achievements: [
      {
        id: "a1",
        name: "FIRST VICTORY",
        description: "Win your first game",
        icon: "trophy",
        date: "03/05/2022",
        rarity: "common",
      },
      {
        id: "a2",
        name: "CHAMPION",
        description: "Win 10 games in a row",
        icon: "medal",
        date: "04/10/2022",
        rarity: "rare",
      },
      {
        id: "a3",
        name: "ON FIRE",
        description: "Score 500+ points in Dino Run",
        icon: "flame",
        date: "05/15/2022",
        rarity: "uncommon",
      },
      {
        id: "a4",
        name: "PONG MASTER",
        description: "Win 50 Pong games",
        icon: "award",
        date: "06/20/2022",
        rarity: "epic",
      },
      {
        id: "a5",
        name: "LEGENDARY",
        description: "Reach level 30",
        icon: "star",
        date: "10/10/2022",
        rarity: "legendary",
      },
    ],
  },
  RETRO_FAN: {
    username: "RETRO_FAN",
    displayName: "Retro Fan",
    avatar: "/placeholder.svg?height=100&width=100",
    level: 18,
    joinDate: "06/15/2022",
    bio: "Passionate about all things retro. Collector of vintage consoles and arcade machines.",
    stats: {
      totalGames: 256,
      winRate: "62%",
      highScore: 1542,
      playtime: "98h",
      achievements: 15,
      rank: "#76",
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
    recentGames: [
      { game: "Pong", opponent: "GAMER42", result: "WIN", score: "10-7", date: "04/15/2023" },
      { game: "Dino", score: 1324, date: "04/12/2023" },
      { game: "Pong", opponent: "PIXEL_MASTER", result: "LOSS", score: "6-10", date: "04/25/2023" },
      { game: "Dino", score: 1102, date: "04/08/2023" },
      { game: "Pong", opponent: "ARCADE_PRO", result: "LOSS", score: "5-10", date: "04/05/2023" },
    ],
    achievements: [
      {
        id: "a1",
        name: "FIRST VICTORY",
        description: "Win your first game",
        icon: "trophy",
        date: "06/20/2022",
        rarity: "common",
      },
      {
        id: "a3",
        name: "ON FIRE",
        description: "Score 500+ points in Dino Run",
        icon: "flame",
        date: "07/15/2022",
        rarity: "uncommon",
      },
      {
        id: "a6",
        name: "COLLECTOR",
        description: "Unlock 5 different skins",
        icon: "package",
        date: "09/10/2022",
        rarity: "rare",
      },
    ],
  },
}

export default function UserProfilePage() {
  const params = useParams()
  const username = params.username as string
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isFriend, setIsFriend] = useState(false)
  const { toast } = useToast()

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
      description: `Une demande d'ami a été envoyée à ${user.username}`,
      duration: 3000,
    })
  }

  const handleMessage = () => {
    toast({
      title: "Message",
      description: `Ouverture de la conversation avec ${user.username}`,
      duration: 3000,
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <MainNav />
        <div className="flex-1 container py-8 px-4 md:px-6 flex items-center justify-center">
          <div className="font-pixel text-xl animate-pulse">CHARGEMENT...</div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <MainNav />
        <div className="flex-1 container py-8 px-4 md:px-6 flex flex-col items-center justify-center">
          <h1 className="font-pixel text-2xl mb-4">UTILISATEUR NON TROUVÉ</h1>
          <p className="font-pixel text-sm text-muted-foreground mb-6">
            L'utilisateur "{username}" n'existe pas ou a été supprimé.
          </p>
          <Button asChild className="font-pixel bg-game-blue hover:bg-game-blue/90">
            <a href="/">RETOUR À L'ACCUEIL</a>
          </Button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainNav />

      <div className="flex-1 container py-8 px-4 md:px-6">
        {/* User Header */}
        <div className="mb-8 bg-card rounded-lg p-6 pixel-border">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="relative">
              <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-game-blue">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
                <AvatarFallback className="font-pixel text-xl">{user.username.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 bg-game-blue text-white font-pixel text-xs px-2 py-1 rounded-md">
                LVL {user.level}
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="font-pixel text-2xl md:text-3xl">{user.displayName}</h1>
              <p className="font-pixel text-sm text-game-blue">@{user.username}</p>
              <p className="font-pixel text-xs text-muted-foreground mt-1">Membre depuis {user.joinDate}</p>
              <p className="mt-4 text-sm">{user.bio}</p>

              <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                <Badge variant="outline" className="font-pixel text-xs">
                  <Trophy className="h-3 w-3 mr-1" />
                  RANG {user.stats.rank}
                </Badge>
                <Badge variant="outline" className="font-pixel text-xs">
                  <GamepadIcon className="h-3 w-3 mr-1" />
                  {user.stats.totalGames} PARTIES
                </Badge>
                <Badge variant="outline" className="font-pixel text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {user.stats.playtime}
                </Badge>
                <Badge variant="outline" className="font-pixel text-xs">
                  <BarChart3 className="h-3 w-3 mr-1" />
                  {user.stats.winRate} VICTOIRES
                </Badge>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-4 md:mt-0">
              {!isFriend ? (
                <Button className="font-pixel bg-game-blue hover:bg-game-blue/90" onClick={handleAddFriend}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  AJOUTER EN AMI
                </Button>
              ) : (
                <Button className="font-pixel bg-game-green hover:bg-game-green/90" onClick={handleMessage}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  ENVOYER UN MESSAGE
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="font-pixel text-xs overflow-x-auto w-full flex-nowrap">
            <TabsTrigger value="overview">APERÇU</TabsTrigger>
            <TabsTrigger value="stats">STATISTIQUES</TabsTrigger>
            <TabsTrigger value="achievements">SUCCÈS</TabsTrigger>
            <TabsTrigger value="history">HISTORIQUE</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="font-pixel text-sm">PARTIES JOUÉES</CardTitle>
                  <GamepadIcon className="text-game-blue h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="font-pixel text-2xl">{user.stats.totalGames}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="font-pixel text-sm">TAUX DE VICTOIRE</CardTitle>
                  <Trophy className="text-game-orange h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="font-pixel text-2xl">{user.stats.winRate}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="font-pixel text-sm">MEILLEUR SCORE</CardTitle>
                  <BarChart3 className="text-game-red h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="font-pixel text-2xl">{user.stats.highScore}</div>
                  <p className="font-pixel text-xs text-muted-foreground">DINO RUN</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="font-pixel text-sm">TEMPS DE JEU</CardTitle>
                  <Clock className="text-game-green h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="font-pixel text-2xl">{user.stats.playtime}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="font-pixel text-sm">DERNIÈRES PARTIES</CardTitle>
                  <CardDescription className="font-pixel text-xs">
                    LES PARTIES RÉCENTES DE {user.username}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {user.recentGames.slice(0, 3).map((game: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-muted rounded-md">
                        <div className="flex items-center space-x-2">
                          {game.game === "Pong" ? (
                            <>
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  game.result === "WIN" ? "bg-game-green" : "bg-game-red"
                                }`}
                              ></div>
                              <p className="font-pixel text-xs">
                                {game.game} VS. {game.opponent}
                              </p>
                            </>
                          ) : (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-game-orange"
                              >
                                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                              </svg>
                              <p className="font-pixel text-xs">{game.game}</p>
                            </>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {game.game === "Pong" ? (
                            <p
                              className={`font-pixel text-xs ${
                                game.result === "WIN" ? "text-game-blue" : "text-game-red"
                              }`}
                            >
                              {game.score}
                            </p>
                          ) : (
                            <p className="font-pixel text-xs text-game-orange">{game.score} PTS</p>
                          )}
                          <p className="font-pixel text-xs text-muted-foreground">{game.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-pixel text-sm">SUCCÈS RÉCENTS</CardTitle>
                  <CardDescription className="font-pixel text-xs">
                    LES DERNIERS SUCCÈS DÉBLOQUÉS PAR {user.username}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {user.achievements.slice(0, 3).map((achievement: any) => (
                      <div key={achievement.id} className="flex items-center space-x-4 p-2 bg-muted rounded-md">
                        <div
                          className={`p-2 rounded-full ${
                            achievement.rarity === "common"
                              ? "bg-gray-500/20"
                              : achievement.rarity === "uncommon"
                                ? "bg-game-green/20"
                                : achievement.rarity === "rare"
                                  ? "bg-game-blue/20"
                                  : achievement.rarity === "epic"
                                    ? "bg-game-orange/20"
                                    : "bg-game-red/20"
                          }`}
                        >
                          <Trophy
                            className={`h-4 w-4 ${
                              achievement.rarity === "common"
                                ? "text-gray-500"
                                : achievement.rarity === "uncommon"
                                  ? "text-game-green"
                                  : achievement.rarity === "rare"
                                    ? "text-game-blue"
                                    : achievement.rarity === "epic"
                                      ? "text-game-orange"
                                      : "text-game-red"
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-pixel text-xs">{achievement.name}</p>
                          <p className="font-pixel text-[10px] text-muted-foreground">{achievement.description}</p>
                        </div>
                        <p className="font-pixel text-xs text-muted-foreground">{achievement.date}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-pixel text-sm">STATISTIQUES PONG</CardTitle>
                <CardDescription className="font-pixel text-xs">PERFORMANCE DE {user.username} EN PONG</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <p className="font-pixel text-xs text-muted-foreground">PARTIES JOUÉES</p>
                    <p className="font-pixel text-xl">{user.gameStats.pong.played}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-pixel text-xs text-muted-foreground">VICTOIRES</p>
                    <p className="font-pixel text-xl">{user.gameStats.pong.wins}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-pixel text-xs text-muted-foreground">DÉFAITES</p>
                    <p className="font-pixel text-xl">{user.gameStats.pong.losses}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-pixel text-xs text-muted-foreground">TAUX DE VICTOIRE</p>
                    <p className="font-pixel text-xl">{user.gameStats.pong.winRate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-pixel text-sm">STATISTIQUES DINO RUN</CardTitle>
                <CardDescription className="font-pixel text-xs">
                  PERFORMANCE DE {user.username} EN DINO RUN
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <p className="font-pixel text-xs text-muted-foreground">PARTIES JOUÉES</p>
                    <p className="font-pixel text-xl">{user.gameStats.dino.played}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-pixel text-xs text-muted-foreground">MEILLEUR SCORE</p>
                    <p className="font-pixel text-xl">{user.gameStats.dino.highScore}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-pixel text-xs text-muted-foreground">SCORE MOYEN</p>
                    <p className="font-pixel text-xl">{user.gameStats.dino.avgScore}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-pixel text-xs text-muted-foreground">DISTANCE TOTALE</p>
                    <p className="font-pixel text-xl">{user.gameStats.dino.totalDistance}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-pixel text-sm">SUCCÈS</CardTitle>
                <CardDescription className="font-pixel text-xs">SUCCÈS DÉBLOQUÉS PAR {user.username}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {user.achievements.map((achievement: any) => (
                    <div key={achievement.id} className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
                      <div
                        className={`p-2 rounded-full ${
                          achievement.rarity === "common"
                            ? "bg-gray-500/20"
                            : achievement.rarity === "uncommon"
                              ? "bg-game-green/20"
                              : achievement.rarity === "rare"
                                ? "bg-game-blue/20"
                                : achievement.rarity === "epic"
                                  ? "bg-game-orange/20"
                                  : "bg-game-red/20"
                        }`}
                      >
                        <Trophy
                          className={`h-6 w-6 ${
                            achievement.rarity === "common"
                              ? "text-gray-500"
                              : achievement.rarity === "uncommon"
                                ? "text-game-green"
                                : achievement.rarity === "rare"
                                  ? "text-game-blue"
                                  : achievement.rarity === "epic"
                                    ? "text-game-orange"
                                    : "text-game-red"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-pixel text-sm">{achievement.name}</p>
                        <p className="font-pixel text-xs text-muted-foreground">{achievement.description}</p>
                        <p className="font-pixel text-xs text-game-blue mt-1">DÉBLOQUÉ: {achievement.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="font-pixel text-sm">HISTORIQUE PONG</CardTitle>
                  <CardDescription className="font-pixel text-xs">
                    PARTIES RÉCENTES DE PONG DE {user.username}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {user.recentGames
                      .filter((game: any) => game.game === "Pong")
                      .map((game: any, index: number) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-muted rounded-md">
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                game.result === "WIN" ? "bg-game-green" : "bg-game-red"
                              }`}
                            ></div>
                            <p className="font-pixel text-xs">VS. {game.opponent}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <p
                              className={`font-pixel text-xs ${
                                game.result === "WIN" ? "text-game-blue" : "text-game-red"
                              }`}
                            >
                              {game.score}
                            </p>
                            <p className="font-pixel text-xs text-muted-foreground">{game.date}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-pixel text-sm">HISTORIQUE DINO RUN</CardTitle>
                  <CardDescription className="font-pixel text-xs">
                    PARTIES RÉCENTES DE DINO RUN DE {user.username}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {user.recentGames
                      .filter((game: any) => game.game === "Dino")
                      .map((game: any, index: number) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-muted rounded-md">
                          <div className="flex items-center space-x-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-game-orange"
                            >
                              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                            </svg>
                            <p className="font-pixel text-xs">DINO RUN</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <p className="font-pixel text-xs text-game-orange">{game.score} PTS</p>
                            <p className="font-pixel text-xs text-muted-foreground">{game.date}</p>
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

      <Footer />
    </div>
  )
}
