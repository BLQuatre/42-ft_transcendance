"use client"

import type React from "react"

import { useState } from "react"
import { MainNav } from "@/components/main-nav"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Footer } from "@/components/footer"
import { Check, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SkinSelector } from "@/components/skin-selector"
import axios from "axios"

// Sample data for charts
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

// Sample game history data
const pongHistory = [
  { opponent: "GAMER42", result: "WIN", score: "10-5", date: "04/20/2023" },
  { opponent: "PIXEL_MASTER", result: "WIN", score: "10-8", date: "04/18/2023" },
  { opponent: "RETRO_FAN", result: "LOSS", score: "7-10", date: "04/15/2023" },
  { opponent: "ARCADE_PRO", result: "WIN", score: "10-2", date: "04/12/2023" },
  { opponent: "JUMP_MASTER", result: "WIN", score: "10-6", date: "04/10/2023" },
]

const dinoHistory = [
  { map: "CLASSIC MAP", score: 753, date: "04/22/2023" },
  { map: "CLASSIC MAP", score: 621, date: "04/20/2023" },
  { map: "CLASSIC MAP", score: 542, date: "04/18/2023" },
  { map: "CLASSIC MAP", score: 498, date: "04/15/2023" },
  { map: "CLASSIC MAP", score: 412, date: "04/12/2023" },
]

// Settings data
const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "ja", name: "Japanese" },
]

// Sample skin data
const characterSkins = [
  {
    id: "cs1",
    name: "CLASSIC PIXEL",
    image: "/placeholder.svg?height=100&width=100",
    owned: true,
  },
  {
    id: "cs2",
    name: "NEON WARRIOR",
    image: "/placeholder.svg?height=100&width=100",
    owned: false,
  },
  {
    id: "cs3",
    name: "ROBOT PLAYER",
    image: "/placeholder.svg?height=100&width=100",
    owned: true,
  },
  {
    id: "cs4",
    name: "GHOST MODE",
    image: "/placeholder.svg?height=100&width=100",
    owned: false,
  },
  {
    id: "cs5",
    name: "RETRO HERO",
    image: "/placeholder.svg?height=100&width=100",
    owned: true,
  },
]

const pongMapSkins = [
  {
    id: "pms1",
    name: "CLASSIC ARENA",
    image: "/placeholder.svg?height=100&width=200",
    owned: true,
  },
  {
    id: "pms2",
    name: "SPACE VOID",
    image: "/placeholder.svg?height=100&width=200",
    owned: false,
  },
  {
    id: "pms3",
    name: "NEON GRID",
    image: "/placeholder.svg?height=100&width=200",
    owned: true,
  },
  {
    id: "pms4",
    name: "RETRO ARCADE",
    image: "/placeholder.svg?height=100&width=200",
    owned: false,
  },
]

const dinoMapSkins = [
  {
    id: "dms1",
    name: "RETRO DESERT",
    image: "/placeholder.svg?height=100&width=200",
    owned: true,
  },
  {
    id: "dms2",
    name: "CYBER CITY",
    image: "/placeholder.svg?height=100&width=200",
    owned: false,
  },
  {
    id: "dms3",
    name: "PIXEL FOREST",
    image: "/placeholder.svg?height=100&width=200",
    owned: true,
  },
]

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [activeSettingsTab, setActiveSettingsTab] = useState("profile")

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)

    axios
      .get("/api/auth/access", {
        headers: {
          Authorization: `token_here`,
        },
      })
      .then((response) => {
        console.log("Token valid:", response.data)
      })
      .catch((error) => {
        console.error("Token invalid:", error.response?.data || error.message)
      })

    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainNav />

      <div className="flex-1 container py-8 px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="font-pixel text-2xl md:text-3xl mb-2">PLAYER DASHBOARD</h1>
            <p className="font-pixel text-xs text-muted-foreground">VIEW YOUR GAME STATISTICS AND PROGRESS</p>
          </div>

          <div className="flex items-center space-x-4">
            <Avatar className="h-10 w-10 border-2 border-game-blue">
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="@player" />
              <AvatarFallback className="font-pixel text-xs">P1</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-pixel text-sm">PLAYER_ONE</p>
              <Badge variant="outline" className="font-pixel text-[10px]">
                LEVEL 12
              </Badge>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="font-pixel text-xs overflow-x-auto w-full flex-nowrap">
            <TabsTrigger value="overview">OVERVIEW</TabsTrigger>
            <TabsTrigger value="history">HISTORY</TabsTrigger>
            <TabsTrigger value="skins">SKINS</TabsTrigger>
            <TabsTrigger value="settings">SETTINGS</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="font-pixel text-sm">TOTAL GAMES</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="square"
                    strokeLinejoin="round"
                    className="text-game-blue h-4 w-4"
                  >
                    <path d="M17 12h-3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2Z"></path>
                    <path d="M10 6H7a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2Z"></path>
                    <path d="M17 6h-3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2Z"></path>
                    <path d="M10 17H7a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2Z"></path>
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="font-pixel text-2xl">128</div>
                  <p className="font-pixel text-xs text-muted-foreground">+12% FROM LAST WEEK</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="font-pixel text-sm">WIN RATE</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="square"
                    strokeLinejoin="round"
                    className="text-game-orange h-4 w-4"
                  >
                    <path d="M12 2v20"></path>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H7"></path>
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="font-pixel text-2xl">64%</div>
                  <p className="font-pixel text-xs text-muted-foreground">+5% FROM LAST WEEK</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="font-pixel text-sm">HIGH SCORE</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="square"
                    strokeLinejoin="round"
                    className="text-game-red h-4 w-4"
                  >
                    <path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14"></path>
                    <path d="M2 20h20"></path>
                    <path d="M14 12v.01"></path>
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="font-pixel text-2xl">1,024</div>
                  <p className="font-pixel text-xs text-muted-foreground">DINO RUN</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="font-pixel text-sm">PLAYTIME</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="square"
                    strokeLinejoin="round"
                    className="text-game-green h-4 w-4"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="font-pixel text-2xl">24h</div>
                  <p className="font-pixel text-xs text-muted-foreground">+2H FROM LAST WEEK</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="font-pixel text-sm">WEEKLY ACTIVITY</CardTitle>
                  <CardDescription className="font-pixel text-xs">NUMBER OF GAMES PLAYED PER DAY</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ChartContainer
                    config={{
                      pong: {
                        label: "Pong Games",
                        color: "hsl(var(--chart-1))",
                      },
                      dino: {
                        label: "Dino Games",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={gamePlayData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="pong" fill="var(--color-pong)" name="Pong" />
                        <Bar dataKey="dino" fill="var(--color-dino)" name="Dino" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-pixel text-sm">SCORE PROGRESSION</CardTitle>
                  <CardDescription className="font-pixel text-xs">YOUR SCORE OVER THE LAST 4 WEEKS</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ChartContainer
                    config={{
                      score: {
                        label: "Score",
                        color: "hsl(var(--chart-3))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={scoreData}>
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
                  <CardTitle className="font-pixel text-sm">PONG MATCH HISTORY</CardTitle>
                  <CardDescription className="font-pixel text-xs">YOUR RECENT PONG GAMES</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pongHistory.map((game, index) => (
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
                  <Button variant="outline" className="w-full mt-4 font-pixel text-xs">
                    VIEW ALL MATCHES
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-pixel text-sm">DINO RUN HISTORY</CardTitle>
                  <CardDescription className="font-pixel text-xs">YOUR RECENT DINO RUN ATTEMPTS</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dinoHistory.map((game, index) => (
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
                          <p className="font-pixel text-xs">{game.map}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <p className="font-pixel text-xs text-game-orange">{game.score} PTS</p>
                          <p className="font-pixel text-xs text-muted-foreground">{game.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4 font-pixel text-xs">
                    VIEW ALL RUNS
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

		  <TabsContent value="skins" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-pixel text-sm">CHARACTER SKINS</CardTitle>
                    <CardDescription className="font-pixel text-xs">CHOOSE YOUR PLAYER APPEARANCE</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SkinSelector
                      title="CHARACTER SKIN"
                      description="CHOOSE YOUR PLAYER APPEARANCE"
                      skins={characterSkins}
                      defaultSelected="cs1"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-pixel text-sm">PONG MAP SKINS</CardTitle>
                    <CardDescription className="font-pixel text-xs">SELECT YOUR PONG GAME ENVIRONMENT</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SkinSelector
                      title="PONG MAP"
                      description="SELECT YOUR PONG GAME ENVIRONMENT"
                      skins={pongMapSkins}
                      defaultSelected="pms1"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-pixel text-sm">DINO RUN MAP SKINS</CardTitle>
                    <CardDescription className="font-pixel text-xs">SELECT YOUR DINO RUN ENVIRONMENT</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SkinSelector
                      title="DINO RUN MAP"
                      description="SELECT YOUR DINO RUN ENVIRONMENT"
                      skins={dinoMapSkins}
                      defaultSelected="dms1"
                    />
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button className="font-pixel bg-game-blue hover:bg-game-blue/90">SAVE SELECTIONS</Button>
                </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Tabs defaultValue={activeSettingsTab} onValueChange={setActiveSettingsTab} className="space-y-4">
              <TabsList className="font-pixel text-xs overflow-x-auto w-full flex-nowrap">
                <TabsTrigger value="profile">PROFILE</TabsTrigger>
                <TabsTrigger value="account">ACCOUNT</TabsTrigger>
                <TabsTrigger value="security">SECURITY</TabsTrigger>
                <TabsTrigger value="appearance">APPEARANCE</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-pixel text-sm">PROFILE</CardTitle>
                    <CardDescription className="font-pixel text-xs">
                      MANAGE YOUR PUBLIC PROFILE INFORMATION
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                      <Avatar className="h-20 w-20 border-2 border-game-blue">
                        <AvatarImage src="/placeholder.svg?height=80&width=80" alt="@player" />
                        <AvatarFallback className="font-pixel text-lg">P1</AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <h3 className="font-pixel text-sm">PROFILE PICTURE</h3>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="font-pixel text-xs">
                            UPLOAD
                          </Button>
                          <Button variant="outline" size="sm" className="font-pixel text-xs text-destructive">
                            REMOVE
                          </Button>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="username" className="font-pixel text-xs">
                            USERNAME
                          </Label>
                          <Input id="username" defaultValue="PLAYER_ONE" className="font-pixel text-sm h-10 bg-muted" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="displayName" className="font-pixel text-xs">
                            DISPLAY NAME
                          </Label>
                          <Input
                            id="displayName"
                            defaultValue="Player One"
                            className="font-pixel text-sm h-10 bg-muted"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio" className="font-pixel text-xs">
                          BIO
                        </Label>
                        <Textarea
                          id="bio"
                          rows={3}
                          defaultValue="Retro gaming enthusiast. Pong champion."
                          className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm font-pixel"
                        />
                      </div>

                      <Button
                        type="submit"
                        className="font-pixel bg-game-blue hover:bg-game-blue/90"
                        disabled={isLoading}
                      >
                        {isLoading ? "SAVING..." : "SAVE CHANGES"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="account" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-pixel text-sm">ACCOUNT INFORMATION</CardTitle>
                    <CardDescription className="font-pixel text-xs">UPDATE YOUR ACCOUNT DETAILS</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="font-pixel text-xs">
                          EMAIL
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          defaultValue="player@example.com"
                          className="font-pixel text-sm h-10 bg-muted"
                        />
                      </div>

                      <Button
                        type="submit"
                        className="font-pixel bg-game-blue hover:bg-game-blue/90"
                        disabled={isLoading}
                      >
                        {isLoading ? "UPDATING..." : "UPDATE EMAIL"}
                      </Button>
                    </form>

                    <Separator className="my-4" />

                    <div className="space-y-2">
                      <h3 className="font-pixel text-sm text-destructive">DANGER ZONE</h3>
                      <p className="font-pixel text-xs text-muted-foreground">
                        ONCE YOU DELETE YOUR ACCOUNT, THERE IS NO GOING BACK. PLEASE BE CERTAIN.
                      </p>
                      <Button variant="destructive" className="font-pixel">
                        DELETE ACCOUNT
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-pixel text-sm">PASSWORD</CardTitle>
                    <CardDescription className="font-pixel text-xs">CHANGE YOUR PASSWORD</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword" className="font-pixel text-xs">
                          CURRENT PASSWORD
                        </Label>
                        <Input id="currentPassword" type="password" className="font-pixel text-sm h-10 bg-muted" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="font-pixel text-xs">
                          NEW PASSWORD
                        </Label>
                        <Input id="newPassword" type="password" className="font-pixel text-sm h-10 bg-muted" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="font-pixel text-xs">
                          CONFIRM NEW PASSWORD
                        </Label>
                        <Input id="confirmPassword" type="password" className="font-pixel text-sm h-10 bg-muted" />
                      </div>

                      <Button
                        type="submit"
                        className="font-pixel bg-game-blue hover:bg-game-blue/90"
                        disabled={isLoading}
                      >
                        {isLoading ? "UPDATING..." : "UPDATE PASSWORD"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-pixel text-sm">TWO-FACTOR AUTHENTICATION</CardTitle>
                    <CardDescription className="font-pixel text-xs">
                      ADD AN EXTRA LAYER OF SECURITY TO YOUR ACCOUNT
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="font-pixel text-sm">2FA STATUS</h3>
                        <p className="font-pixel text-xs text-muted-foreground">
                          TWO-FACTOR AUTHENTICATION IS CURRENTLY DISABLED
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="font-pixel">
                      SETUP 2FA
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="appearance" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-pixel text-sm">THEME</CardTitle>
                    <CardDescription className="font-pixel text-xs">
                      CUSTOMIZE THE APPEARANCE OF THE APPLICATION
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="font-pixel text-sm">DARK MODE</h3>
                        <p className="font-pixel text-xs text-muted-foreground">TOGGLE BETWEEN LIGHT AND DARK MODE</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-pixel text-sm">COLOR THEME</h3>
                      <div className="grid grid-cols-5 gap-2">
                        {["#4A9DFF", "#FFA500", "#FF4D4D", "#4CAF50", "#9C27B0"].map((color, index) => (
                          <button
                            key={index}
                            className={`h-12 w-full rounded-md border-2 ${index === 0 ? "border-white" : "border-transparent"}`}
                            style={{ backgroundColor: color }}
                            onClick={() => {}}
                            aria-label={`Color theme ${index + 1}`}
                          >
                            {index === 0 && <Check className="h-6 w-6 text-white mx-auto" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-pixel text-sm">LANGUAGE</h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="w-full justify-between font-pixel">
                            <span>ENGLISH</span>
                            <ChevronDown className="h-4 w-4 opacity-50" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full" align="end">
                          {languages.map((language) => (
                            <DropdownMenuItem
                              key={language.code}
                              className="font-pixel text-xs cursor-pointer"
                              onClick={() => {}}
                            >
                              {language.name.toUpperCase()}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="font-pixel bg-game-blue hover:bg-game-blue/90">SAVE PREFERENCES</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  )
}
