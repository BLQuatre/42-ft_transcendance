"use client"

import React from "react"

import { useState } from "react"
import { MainNav } from "@/components/Navbar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/Chart"
import { Line, LineChart, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Textarea } from "@/components/ui/TextArea"
import { Separator } from "@/components/ui/Separator"
import { SkinSelector } from "@/components/SkinSelector"
import { MatchDetailsDialog } from "@/components/dialog/MatchDetailsDialog"
import { TwoFactorSetupDialog } from "@/components/dialog/TwoFactorSetupDialog"
import { LogOut } from "lucide-react"
import axios from "axios"
import { useDictionary } from "@/hooks/UseDictionnary"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"

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

// Sample game history data with support for multiple players (up to 8)
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
  const [activeSettingsTab, setActiveSettingsTab] = useState("account")
  const [selectedMatch, setSelectedMatch] = useState<null | {
    type: "pong" | "dino"
    details: any
  }>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false)
  const [saveSkinDialogOpen, setSaveSkinDialogOpen] = useState(false)
  const [updatePasswordDialogOpen, setUpdatePasswordDialogOpen] = useState(false)
  const [removeAvatarDialogOpen, setRemoveAvatarDialogOpen] = useState(false)
  const [twoFactorSetupOpen, setTwoFactorSetupOpen] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [secretHash, setSecretHash] = useState<string | undefined>(undefined)
  const [remove2FADialogOpen, setRemove2FADialogOpen] = useState(false)

  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleMatchClick = (type: "pong" | "dino", details: any) => {
    setSelectedMatch({ type, details })
    setDialogOpen(true)
  }

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

  const handleLogout = () => {
    setLogoutDialogOpen(true)
  }

  const confirmLogout = () => {
    console.log("Logging out...")
    // Example: redirect to login page
    window.location.href = "/login"
    setLogoutDialogOpen(false)
  }

  const handleDeleteAccount = () => {
    setDeleteAccountDialogOpen(true)
  }

  const confirmDeleteAccount = () => {
    console.log("Deleting account...")
    // Implement actual account deletion logic here
    setDeleteAccountDialogOpen(false)
  }

  const handleSaveSkins = () => {
    setSaveSkinDialogOpen(true)
  }

  const confirmSaveSkins = () => {
    console.log("Saving skin selections...")
    // Implement actual skin saving logic here
    setSaveSkinDialogOpen(false)
  }

  const handleUpdatePassword = (event: React.FormEvent) => {
    event.preventDefault()
    setUpdatePasswordDialogOpen(true)
  }

  const confirmUpdatePassword = () => {
    console.log("Updating password...")
    // Implement actual password update logic here
    setUpdatePasswordDialogOpen(false)
  }

  const handleUploadAvatar = () => {
    // Trigger the hidden file input click
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      console.log("File selected:", file)
      // Here you would typically upload the file to your server
      // and update the user's avatar
    }
  }

  const handleRemoveAvatar = () => {
    setRemoveAvatarDialogOpen(true)
  }

  const confirmRemoveAvatar = () => {
    console.log("Removing avatar...")
    // Implement actual avatar removal logic here
    setRemoveAvatarDialogOpen(false)
  }

  const handleSetup2FA = async () => {
    // In a real app, you would fetch the secret hash from your backend here
    try {
      setIsLoading(true)

      // Simulate API call to backend to get a secret hash
      // In a real app, this would be an actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock response from backend with the secret hash
      const mockResponse = {
        success: true,
        data: {
          secret: "JBSWY3DPEHPK3PXP", // Example secret hash from backend
        },
      }

      if (mockResponse.success) {
        // Store the secret hash from the backend
        setSecretHash(mockResponse.data.secret)
        // Open the 2FA setup dialog
        setTwoFactorSetupOpen(true)
      } else {
        console.error("Failed to get 2FA secret from server")
      }
    } catch (error) {
      console.error("Error initializing 2FA:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handle2FAComplete = () => {
    // Simply enable 2FA
    setTwoFactorEnabled(true)

    // In a real app, you would make an API call to confirm 2FA is enabled
    console.log("2FA has been enabled successfully")
  }

  const dict = useDictionary()
  if (!dict) return null

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainNav />

      <div className="flex-1 container py-8 px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="font-pixel text-2xl md:text-3xl mb-2 uppercase">{dict.dashboard.title}</h1>
            <p className="font-pixel text-xs text-muted-foreground uppercase">{dict.dashboard.description}</p>
          </div>

          <div className="flex items-center space-x-4">
            <Avatar className="h-10 w-10 border-2 border-game-blue">
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="@player" />
              <AvatarFallback className="font-pixel text-xs">P1</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start">
              <p className="font-pixel text-sm">PLAYER_ONE</p>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="font-pixel text-xs text-game-red hover:bg-red-100/10 hover:text-game-red border-game-red/30 mt-1 h-7 px-2 cursor-pointer transition-all duration-200 active:scale-95"
              >
                <LogOut className="h-3 w-3 mr-1" />
                LOGOUT
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="font-pixel text-xs overflow-x-auto w-full flex-nowrap">
            <TabsTrigger className="uppercase" value="overview">
              {dict.dashboard.sections.overview.title}
            </TabsTrigger>
            <TabsTrigger className="uppercase" value="history">
              HISTORY
            </TabsTrigger>
            <TabsTrigger className="uppercase" value="skins">
              SKINS
            </TabsTrigger>
            <TabsTrigger className="uppercase" value="settings">
              {dict.dashboard.sections.settings.title}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="font-pixel text-sm uppercase">
                    {dict.dashboard.sections.overview.totalGames}
                  </CardTitle>
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
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="font-pixel text-sm uppercase">
                    {dict.dashboard.sections.overview.winRate}
                  </CardTitle>
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
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="font-pixel text-sm uppercase">
                    {dict.dashboard.sections.overview.highScore} {dict.games.dino.title}
                  </CardTitle>
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
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="font-pixel text-sm uppercase">
                    {dict.dashboard.sections.overview.charts.activity.title}
                  </CardTitle>
                  <CardDescription className="font-pixel text-xs uppercase">
                    {dict.dashboard.sections.overview.charts.activity.description}
                  </CardDescription>
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
                        <Bar dataKey="pong" fill="var(--color-primary)" name={dict.games.pong.title} />
                        <Bar dataKey="dino" fill="var(--color-secondary)" name={dict.games.dino.title} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-pixel text-sm uppercase">
                    {dict.dashboard.sections.overview.charts.score.title}
                  </CardTitle>
                  <CardDescription className="font-pixel text-xs uppercase">
                    {dict.dashboard.sections.overview.charts.score.description}
                  </CardDescription>
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
                          name={dict.dashboard.sections.overview.charts.score.label}
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
                  <div className="space-y-3 h-[480px] overflow-y-auto pr-2 show-scrollbar">
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
                  <div className="space-y-3 h-[480px] overflow-y-auto pr-2 show-scrollbar">
                    {dinoHistory.map((game, index) => (
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
              <Button className="font-pixel bg-game-blue hover:bg-game-blue/90" onClick={handleSaveSkins}>
                SAVE SELECTIONS
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Tabs defaultValue={activeSettingsTab} onValueChange={setActiveSettingsTab} className="space-y-4">
              <TabsList className="font-pixel text-xs overflow-x-auto w-full flex-nowrap">
                <TabsTrigger className="uppercase" value="account">
                  {dict.dashboard.sections.settings.title}
                </TabsTrigger>
                <TabsTrigger className="uppercase" value="security">
                  {dict.dashboard.sections.settings.security.title}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="account" className="space-y-4 h-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-pixel text-sm uppercase">
                      {dict.dashboard.sections.settings.account.title}
                    </CardTitle>
                    <CardDescription className="font-pixel text-xs uppercase">
                      {dict.dashboard.sections.settings.account.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                      <Avatar className="h-20 w-20 border-2 border-game-blue">
                        <AvatarImage src="/placeholder.svg?height=80&width=80" alt="@player" />
                        <AvatarFallback className="font-pixel text-lg">P1</AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <h3 className="font-pixel text-sm uppercase">
                          {dict.dashboard.sections.settings.account.picture}
                        </h3>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="font-pixel text-xs uppercase"
                            onClick={handleUploadAvatar}
                          >
                            {dict.common.upload}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="font-pixel text-xs text-destructive uppercase"
                            onClick={handleRemoveAvatar}
                          >
                            {dict.common.remove}
                          </Button>
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                          />
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="username" className="font-pixel text-xs uppercase">
                            {dict.dashboard.sections.settings.account.username}
                          </Label>
                          <Input id="username" defaultValue="PLAYER_ONE" className="font-pixel text-sm h-10 bg-muted" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio" className="font-pixel text-xs uppercase">
                          {dict.dashboard.sections.settings.account.bio}
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
                        className="font-pixel bg-game-blue hover:bg-game-blue/90 uppercase"
                        disabled={isLoading}
                      >
                        {isLoading ? dict.common.saving : dict.common.save}
                      </Button>
                    </form>

                    <Separator className="my-4" />

                    <div className="space-y-2">
                      <h3 className="font-pixel text-sm text-destructive uppercase">
                        {dict.dashboard.sections.settings.account.dangerZone.title}
                      </h3>
                      <p className="font-pixel text-xs text-muted-foreground uppercase">
                        {dict.dashboard.sections.settings.account.dangerZone.description}.
                      </p>
                      <Button variant="destructive" className="font-pixel uppercase" onClick={handleDeleteAccount}>
                        {dict.dashboard.sections.settings.account.dangerZone.delete}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-pixel text-sm uppercase">
                      {dict.dashboard.sections.settings.security.password.title}
                    </CardTitle>
                    <CardDescription className="font-pixel text-xs uppercase">
                      {dict.dashboard.sections.settings.security.password.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword" className="font-pixel text-xs uppercase">
                          {dict.dashboard.sections.settings.security.password.current}
                        </Label>
                        <Input id="currentPassword" type="password" className="font-pixel text-sm h-10 bg-muted" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="font-pixel text-xs uppercase">
                          {dict.dashboard.sections.settings.security.password.new}
                        </Label>
                        <Input id="newPassword" type="password" className="font-pixel text-sm h-10 bg-muted" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="font-pixel text-xs uppercase">
                          {dict.dashboard.sections.settings.security.password.confirm}
                        </Label>
                        <Input id="confirmPassword" type="password" className="font-pixel text-sm h-10 bg-muted" />
                      </div>

                      <Button
                        type="submit"
                        className="font-pixel bg-game-blue hover:bg-game-blue/90 uppercase"
                        disabled={isLoading}
                      >
                        {isLoading ? dict.common.updating : dict.dashboard.sections.settings.security.password.update}
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
                          {twoFactorEnabled
                            ? "TWO-FACTOR AUTHENTICATION IS ENABLED"
                            : "TWO-FACTOR AUTHENTICATION IS CURRENTLY DISABLED"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    {twoFactorEnabled ? (
                      <Button variant="destructive" className="font-pixel" onClick={() => setRemove2FADialogOpen(true)}>
                        REMOVE 2FA
                      </Button>
                    ) : (
                      <Button variant="outline" className="font-pixel" onClick={handleSetup2FA}>
                        SETUP 2FA
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>

      {/* Match Details Dialog */}
      <MatchDetailsDialog open={dialogOpen} onOpenChange={setDialogOpen} match={selectedMatch} />

      {/* 2FA Setup Dialog with the secret hash from backend */}
      <TwoFactorSetupDialog
        open={twoFactorSetupOpen}
        onOpenChange={setTwoFactorSetupOpen}
        onComplete={handle2FAComplete}
        secretHash={secretHash}
        userEmail="player_one@example.com" // Pass the user's email
        appName="RetroArcade" // Your app name
      />

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-pixel text-lg uppercase">Confirm Logout</DialogTitle>
            <DialogDescription className="font-pixel text-xs uppercase">
              Are you sure you want to log out of your account?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:space-x-2">
            <Button
              type="button"
              variant="outline"
              className="font-pixel text-xs uppercase"
              onClick={() => setLogoutDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="font-pixel text-xs uppercase"
              onClick={confirmLogout}
            >
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={deleteAccountDialogOpen} onOpenChange={setDeleteAccountDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-pixel text-lg uppercase">Confirm Account Deletion</DialogTitle>
            <DialogDescription className="font-pixel text-xs uppercase">
              Are you sure you want to delete your account? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:space-x-2">
            <Button
              type="button"
              variant="outline"
              className="font-pixel text-xs uppercase"
              onClick={() => setDeleteAccountDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="font-pixel text-xs uppercase"
              onClick={confirmDeleteAccount}
            >
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Save Skins Confirmation Dialog */}
      <Dialog open={saveSkinDialogOpen} onOpenChange={setSaveSkinDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-pixel text-lg uppercase">Confirm Skin Selection</DialogTitle>
            <DialogDescription className="font-pixel text-xs uppercase">
              Are you sure you want to save your skin selections?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:space-x-2">
            <Button
              type="button"
              variant="outline"
              className="font-pixel text-xs uppercase"
              onClick={() => setSaveSkinDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="font-pixel text-xs uppercase bg-game-blue hover:bg-game-blue/90"
              onClick={confirmSaveSkins}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Password Confirmation Dialog */}
      <Dialog open={updatePasswordDialogOpen} onOpenChange={setUpdatePasswordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-pixel text-lg uppercase">Confirm Password Update</DialogTitle>
            <DialogDescription className="font-pixel text-xs uppercase">
              Are you sure you want to update your password?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:space-x-2">
            <Button
              type="button"
              variant="outline"
              className="font-pixel text-xs uppercase"
              onClick={() => setUpdatePasswordDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="font-pixel text-xs uppercase bg-game-blue hover:bg-game-blue/90"
              onClick={confirmUpdatePassword}
            >
              Update Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Avatar Confirmation Dialog */}
      <Dialog open={removeAvatarDialogOpen} onOpenChange={setRemoveAvatarDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-pixel text-lg uppercase">Confirm Remove Avatar</DialogTitle>
            <DialogDescription className="font-pixel text-xs uppercase">
              Are you sure you want to remove your profile picture? The default avatar will be used instead.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:space-x-2">
            <Button
              type="button"
              variant="outline"
              className="font-pixel text-xs uppercase"
              onClick={() => setRemoveAvatarDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="font-pixel text-xs uppercase"
              onClick={confirmRemoveAvatar}
            >
              Remove Avatar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove 2FA Confirmation Dialog */}
      <Dialog open={remove2FADialogOpen} onOpenChange={setRemove2FADialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-pixel text-lg uppercase">Disable Two-Factor Authentication</DialogTitle>
            <DialogDescription className="font-pixel text-xs uppercase">
              Are you sure you want to disable two-factor authentication? This will make your account less secure.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:space-x-2">
            <Button
              type="button"
              variant="outline"
              className="font-pixel text-xs uppercase"
              onClick={() => setRemove2FADialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="font-pixel text-xs uppercase"
              onClick={() => {
                setTwoFactorEnabled(false)
                setRemove2FADialogOpen(false)
              }}
            >
              Disable 2FA
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
