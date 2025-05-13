"use client"

import { MainNav } from "@/components/main-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"

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

export default function DashboardPage() {
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
            <TabsTrigger value="pong">PONG STATS</TabsTrigger>
            <TabsTrigger value="dino">DINO STATS</TabsTrigger>
            <TabsTrigger value="history">GAME HISTORY</TabsTrigger>
            <TabsTrigger value="achievements">ACHIEVEMENTS</TabsTrigger>
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

          <TabsContent value="pong" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-pixel text-sm">PONG STATISTICS</CardTitle>
                <CardDescription className="font-pixel text-xs">YOUR PERFORMANCE IN PONG GAMES</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <p className="font-pixel text-xs text-muted-foreground">GAMES PLAYED</p>
                    <p className="font-pixel text-xl">76</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-pixel text-xs text-muted-foreground">WINS</p>
                    <p className="font-pixel text-xl">48</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-pixel text-xs text-muted-foreground">LOSSES</p>
                    <p className="font-pixel text-xl">28</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-pixel text-xs text-muted-foreground">WIN RATE</p>
                    <p className="font-pixel text-xl">63%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dino" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-pixel text-sm">DINO STATISTICS</CardTitle>
                <CardDescription className="font-pixel text-xs">YOUR PERFORMANCE IN DINO RUN GAMES</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <p className="font-pixel text-xs text-muted-foreground">GAMES PLAYED</p>
                    <p className="font-pixel text-xl">52</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-pixel text-xs text-muted-foreground">HIGH SCORE</p>
                    <p className="font-pixel text-xl">1,024</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-pixel text-xs text-muted-foreground">AVERAGE SCORE</p>
                    <p className="font-pixel text-xl">512</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-pixel text-xs text-muted-foreground">TOTAL DISTANCE</p>
                    <p className="font-pixel text-xl">42km</p>
                  </div>
                </div>
              </CardContent>
            </Card>
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

          <TabsContent value="achievements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-pixel text-sm">ACHIEVEMENTS</CardTitle>
                <CardDescription className="font-pixel text-xs">YOUR UNLOCKED ACHIEVEMENTS</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
                    <div className="p-2 bg-game-blue/20 rounded-full">
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
                        className="text-game-blue h-6 w-6"
                      >
                        <path d="M12 2v4"></path>
                        <path d="M12 18v4"></path>
                        <path d="m4.93 4.93 2.83 2.83"></path>
                        <path d="m16.24 16.24 2.83 2.83"></path>
                        <path d="M2 12h4"></path>
                        <path d="M18 12h4"></path>
                        <path d="m4.93 19.07 2.83-2.83"></path>
                        <path d="m16.24 7.76 2.83-2.83"></path>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-pixel text-sm">FIRST VICTORY</p>
                      <p className="font-pixel text-xs text-muted-foreground">WIN YOUR FIRST GAME</p>
                      <p className="font-pixel text-xs text-game-blue mt-1">UNLOCKED: 04/15/2023</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
                    <div className="p-2 bg-game-orange/20 rounded-full">
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
                        className="text-game-orange h-6 w-6"
                      >
                        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                        <path d="M4 22h16"></path>
                        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-pixel text-sm">CHAMPION</p>
                      <p className="font-pixel text-xs text-muted-foreground">WIN 10 GAMES IN A ROW</p>
                      <p className="font-pixel text-xs text-game-orange mt-1">UNLOCKED: 06/22/2023</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
                    <div className="p-2 bg-game-red/20 rounded-full">
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
                        className="text-game-red h-6 w-6"
                      >
                        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-pixel text-sm">ON FIRE</p>
                      <p className="font-pixel text-xs text-muted-foreground">SCORE 500+ POINTS IN DINO RUN</p>
                      <p className="font-pixel text-xs text-game-red mt-1">UNLOCKED: 08/03/2023</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
                    <div className="p-2 bg-game-green/20 rounded-full">
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
                        className="text-game-green h-6 w-6"
                      >
                        <path d="M12 2v8"></path>
                        <path d="m4.93 10.93 1.41 1.41"></path>
                        <path d="M2 18h2"></path>
                        <path d="M20 18h2"></path>
                        <path d="m19.07 10.93-1.41 1.41"></path>
                        <path d="M22 22H2"></path>
                        <path d="M16 6 8 14"></path>
                        <path d="m16 14-2-2-6-6"></path>
                        <path d="M8 6h8"></path>
                        <path d="M10.5 6v4"></path>
                        <path d="M13.5 6v4"></path>
                        <path d="M16 14H8"></path>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-pixel text-sm">PONG MASTER</p>
                      <p className="font-pixel text-xs text-muted-foreground">WIN 50 PONG GAMES</p>
                      <p className="font-pixel text-xs text-game-green mt-1">UNLOCKED: 09/15/2023</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  )
}
