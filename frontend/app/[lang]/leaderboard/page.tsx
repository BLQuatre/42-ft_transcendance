import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { MainNav } from "@/components/Navbar"
import { Trophy, Medal, Clock, Gamepad2, ArrowLeft } from "lucide-react"
import { Language } from "@/types/types"
import { getDictionary } from "@/lib/Dictionnaries"

export default async function LeaderboardPage({
  params,
}: {
  params: Promise<{ lang: Language }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainNav />

      <main className="flex-1">
        <section className="py-12 md:py-24 lg:py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center mb-12">
              <h2 className="font-pixel text-2xl md:text-4xl text-game-orange">LEADERBOARDS</h2>
              <div className="w-20 h-1 bg-game-orange"></div>
              <p className="max-w-3xl text-muted-foreground font-pixel text-sm">
                CHECK OUT THE TOP PLAYERS ACROSS OUR ARCADE GAMES. CAN YOU BEAT THEIR HIGH SCORES?
              </p>
              <Button asChild variant="outline" className="font-pixel mt-2">
                <Link href="/" className="flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  BACK TO GAMES
                </Link>
              </Button>
            </div>

            {/* Pong Leaderboard */}
            <div className="mb-16">
              <div className="rounded-xl pixel-border bg-card overflow-hidden">
                <div className="p-6 bg-game-blue/10">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div className="flex items-center">
                      <div className="bg-game-blue rounded-full p-2 mr-3">
                        <Gamepad2 className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-pixel text-2xl text-game-blue">PONG CHAMPIONS</h3>
                    </div>
                    <Button asChild className="font-pixel bg-game-blue hover:bg-game-blue/90">
                      <Link href="/games/pong">PLAY PONG</Link>
                    </Button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="font-pixel text-left py-3 px-4 text-xs text-muted-foreground">RANK</th>
                          <th className="font-pixel text-left py-3 px-4 text-xs text-muted-foreground">PLAYER</th>
                          <th className="font-pixel text-left py-3 px-4 text-xs text-muted-foreground">WINS</th>
                          <th className="font-pixel text-left py-3 px-4 text-xs text-muted-foreground">
                            POINTS SCORED
                          </th>
                          <th className="font-pixel text-left py-3 px-4 text-xs text-muted-foreground">WIN STREAK</th>
                          <th className="font-pixel text-left py-3 px-4 text-xs text-muted-foreground">LAST PLAYED</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border bg-game-blue/5">
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
                              <span className="font-pixel text-sm">1</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-game-blue/20 flex items-center justify-center mr-3">
                                <span className="font-pixel text-game-blue">PX</span>
                              </div>
                              <span className="font-pixel text-sm">PIXELMASTER</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-pixel text-sm">42</td>
                          <td className="py-4 px-4 font-pixel text-sm">386</td>
                          <td className="py-4 px-4 font-pixel text-sm">12</td>
                          <td className="py-4 px-4 font-pixel text-xs text-muted-foreground">2 HOURS AGO</td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <Medal className="h-5 w-5 text-gray-400 mr-2" />
                              <span className="font-pixel text-sm">2</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-game-blue/20 flex items-center justify-center mr-3">
                                <span className="font-pixel text-game-blue">RK</span>
                              </div>
                              <span className="font-pixel text-sm">RETROKID</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-pixel text-sm">38</td>
                          <td className="py-4 px-4 font-pixel text-sm">352</td>
                          <td className="py-4 px-4 font-pixel text-sm">9</td>
                          <td className="py-4 px-4 font-pixel text-xs text-muted-foreground">1 DAY AGO</td>
                        </tr>
                        <tr className="border-b border-border bg-game-blue/5">
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <Medal className="h-5 w-5 text-amber-700 mr-2" />
                              <span className="font-pixel text-sm">3</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-game-blue/20 flex items-center justify-center mr-3">
                                <span className="font-pixel text-game-blue">AR</span>
                              </div>
                              <span className="font-pixel text-sm">ARCADERULER</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-pixel text-sm">35</td>
                          <td className="py-4 px-4 font-pixel text-sm">310</td>
                          <td className="py-4 px-4 font-pixel text-sm">7</td>
                          <td className="py-4 px-4 font-pixel text-xs text-muted-foreground">3 DAYS AGO</td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <span className="font-pixel text-sm ml-7">4</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-game-blue/20 flex items-center justify-center mr-3">
                                <span className="font-pixel text-game-blue">BG</span>
                              </div>
                              <span className="font-pixel text-sm">BITGAMER</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-pixel text-sm">29</td>
                          <td className="py-4 px-4 font-pixel text-sm">278</td>
                          <td className="py-4 px-4 font-pixel text-sm">5</td>
                          <td className="py-4 px-4 font-pixel text-xs text-muted-foreground">1 WEEK AGO</td>
                        </tr>
                        <tr className="bg-game-blue/5">
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <span className="font-pixel text-sm ml-7">5</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-game-blue/20 flex items-center justify-center mr-3">
                                <span className="font-pixel text-game-blue">GP</span>
                              </div>
                              <span className="font-pixel text-sm">GAMEPRO</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-pixel text-sm">24</td>
                          <td className="py-4 px-4 font-pixel text-sm">245</td>
                          <td className="py-4 px-4 font-pixel text-sm">4</td>
                          <td className="py-4 px-4 font-pixel text-xs text-muted-foreground">2 WEEKS AGO</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Dino Run Leaderboard */}
            <div>
              <div className="rounded-xl pixel-border bg-card overflow-hidden">
                <div className="p-6 bg-game-orange/10">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div className="flex items-center">
                      <div className="bg-game-orange rounded-full p-2 mr-3">
                        <Gamepad2 className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-pixel text-2xl text-game-orange">DINO RUN LEGENDS</h3>
                    </div>
                    <Button asChild className="font-pixel bg-game-orange hover:bg-game-orange/90">
                      <Link href="/games/dino">PLAY DINO RUN</Link>
                    </Button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="font-pixel text-left py-3 px-4 text-xs text-muted-foreground">RANK</th>
                          <th className="font-pixel text-left py-3 px-4 text-xs text-muted-foreground">PLAYER</th>
                          <th className="font-pixel text-left py-3 px-4 text-xs text-muted-foreground">HIGH SCORE</th>
                          <th className="font-pixel text-left py-3 px-4 text-xs text-muted-foreground">DISTANCE (M)</th>
                          <th className="font-pixel text-left py-3 px-4 text-xs text-muted-foreground">
                            OBSTACLES CLEARED
                          </th>
                          <th className="font-pixel text-left py-3 px-4 text-xs text-muted-foreground">LAST PLAYED</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border bg-game-orange/5">
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
                              <span className="font-pixel text-sm">1</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-game-orange/20 flex items-center justify-center mr-3">
                                <span className="font-pixel text-game-orange">JR</span>
                              </div>
                              <span className="font-pixel text-sm">JUMPREX</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-pixel text-sm">12,458</td>
                          <td className="py-4 px-4 font-pixel text-sm">4,152</td>
                          <td className="py-4 px-4 font-pixel text-sm">328</td>
                          <td className="py-4 px-4 font-pixel text-xs text-muted-foreground">5 HOURS AGO</td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <Medal className="h-5 w-5 text-gray-400 mr-2" />
                              <span className="font-pixel text-sm">2</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-game-orange/20 flex items-center justify-center mr-3">
                                <span className="font-pixel text-game-orange">DS</span>
                              </div>
                              <span className="font-pixel text-sm">DINOSPRINTER</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-pixel text-sm">11,872</td>
                          <td className="py-4 px-4 font-pixel text-sm">3,957</td>
                          <td className="py-4 px-4 font-pixel text-sm">312</td>
                          <td className="py-4 px-4 font-pixel text-xs text-muted-foreground">12 HOURS AGO</td>
                        </tr>
                        <tr className="border-b border-border bg-game-orange/5">
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <Medal className="h-5 w-5 text-amber-700 mr-2" />
                              <span className="font-pixel text-sm">3</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-game-orange/20 flex items-center justify-center mr-3">
                                <span className="font-pixel text-game-orange">RR</span>
                              </div>
                              <span className="font-pixel text-sm">REXRUNNER</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-pixel text-sm">10,543</td>
                          <td className="py-4 px-4 font-pixel text-sm">3,514</td>
                          <td className="py-4 px-4 font-pixel text-sm">289</td>
                          <td className="py-4 px-4 font-pixel text-xs text-muted-foreground">1 DAY AGO</td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <span className="font-pixel text-sm ml-7">4</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-game-orange/20 flex items-center justify-center mr-3">
                                <span className="font-pixel text-game-orange">CJ</span>
                              </div>
                              <span className="font-pixel text-sm">CACTIJUMPER</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-pixel text-sm">9,876</td>
                          <td className="py-4 px-4 font-pixel text-sm">3,292</td>
                          <td className="py-4 px-4 font-pixel text-sm">274</td>
                          <td className="py-4 px-4 font-pixel text-xs text-muted-foreground">3 DAYS AGO</td>
                        </tr>
                        <tr className="bg-game-orange/5">
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <span className="font-pixel text-sm ml-7">5</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-game-orange/20 flex items-center justify-center mr-3">
                                <span className="font-pixel text-game-orange">PD</span>
                              </div>
                              <span className="font-pixel text-sm">PIXELDINO</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-pixel text-sm">8,754</td>
                          <td className="py-4 px-4 font-pixel text-sm">2,918</td>
                          <td className="py-4 px-4 font-pixel text-sm">243</td>
                          <td className="py-4 px-4 font-pixel text-xs text-muted-foreground">1 WEEK AGO</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Champions Section */}
            <div className="mt-16">
              <div className="flex flex-col items-center space-y-4 text-center mb-8">
                <h3 className="font-pixel text-xl md:text-2xl text-game-blue">WEEKLY CHAMPIONS</h3>
                <div className="w-16 h-1 bg-game-blue"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Top Player Card */}
                <div className="rounded-xl pixel-border bg-card overflow-hidden">
                  <div className="p-6 flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-game-blue/20 flex items-center justify-center mb-4 relative">
                      <span className="font-pixel text-2xl text-game-blue">PX</span>
                      <div className="absolute -top-2 -right-2 bg-yellow-500 rounded-full p-1">
                        <Trophy className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <h4 className="font-pixel text-lg mb-1">PIXELMASTER</h4>
                    <p className="font-pixel text-xs text-muted-foreground mb-3">PONG CHAMPION</p>
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Trophy className="h-4 w-4 text-game-blue" />
                      <span className="font-pixel text-sm">42 WINS</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-pixel text-xs text-muted-foreground">ACTIVE SINCE 2023</span>
                    </div>
                  </div>
                </div>

                {/* Top Player Card */}
                <div className="rounded-xl pixel-border bg-card overflow-hidden">
                  <div className="p-6 flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-game-orange/20 flex items-center justify-center mb-4 relative">
                      <span className="font-pixel text-2xl text-game-orange">JR</span>
                      <div className="absolute -top-2 -right-2 bg-yellow-500 rounded-full p-1">
                        <Trophy className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <h4 className="font-pixel text-lg mb-1">JUMPREX</h4>
                    <p className="font-pixel text-xs text-muted-foreground mb-3">DINO RUN LEGEND</p>
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Trophy className="h-4 w-4 text-game-orange" />
                      <span className="font-pixel text-sm">12,458 POINTS</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-pixel text-xs text-muted-foreground">ACTIVE SINCE 2022</span>
                    </div>
                  </div>
                </div>

                {/* Most Improved Player Card */}
                <div className="rounded-xl pixel-border bg-card overflow-hidden">
                  <div className="p-6 flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-purple-500/20 flex items-center justify-center mb-4 relative">
                      <span className="font-pixel text-2xl text-purple-500">NG</span>
                      <div className="absolute -top-2 -right-2 bg-purple-500 rounded-full p-1">
                        <Medal className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <h4 className="font-pixel text-lg mb-1">NEWGAMER</h4>
                    <p className="font-pixel text-xs text-muted-foreground mb-3">MOST IMPROVED</p>
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Trophy className="h-4 w-4 text-purple-500" />
                      <span className="font-pixel text-sm">+248% IMPROVEMENT</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-pixel text-xs text-muted-foreground">JOINED 2 WEEKS AGO</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
