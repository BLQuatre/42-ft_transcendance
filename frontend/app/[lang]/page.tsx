import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/Button"
import { MainNav } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { getDictionary } from "@/lib/dictionnaries"
import { Language } from "@/types/language"
import { GameButtons } from "@/components/GameButtons"
import { GameType } from "@/types/game"
import { Bell, BarChart3, Settings } from "lucide-react"

export default async function HomePage({
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
        {/* Games Section - Moved to the top for prominence */}
        <section className="py-8 md:py-16 lg:py-20 border-b border-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center mb-8">
              <h2 className="font-pixel text-2xl md:text-4xl bg-linear-to-r from-game-blue via-game-orange to-game-red bg-clip-text text-transparent animate-pulse">
                ft_transcendance
              </h2>
              <div className="w-32 h-1 bg-linear-to-r from-game-blue via-game-orange to-game-red"></div>
              <p className="font-pixel text-sm md:text-base text-muted-foreground max-w-[700px] mx-auto uppercase">
                {dict.home.description}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              {/* Pong Game */}
              <div className="group relative overflow-hidden rounded-lg pixel-border bg-card transition-all hover:shadow-xl">
                <div className="aspect-video overflow-hidden">
                  <Image
                    src="/images/pong.png"
                    alt="Pong Game"
                    width={700}
                    height={400}
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-6 flex flex-col h-[200px]">
                  <h3 className="font-pixel text-xl text-game-blue mb-2 uppercase">PONG</h3>
                  <p className="font-pixel text-xs text-muted-foreground mb-4 uppercase">
                    {dict.games.pong.description}
                  </p>
                  <div className="flex flex-col space-y-3 mt-auto">
                    <div className="flex justify-between items-center">
                      <GameButtons
                        gameType={GameType.PONG}
                        buttonText={`${dict.common.play} PONG`}
                      />
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="font-pixel border border-game-blue text-game-blue hover:bg-game-blue/10 hover:text-game-blue ml-2 flex items-center self-center h-9"
                      >
                        <Link className="uppercase" href="/games#pong">
                          {dict.home.gamerules} &gt;
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dino Game */}
              <div className="group relative overflow-hidden rounded-lg pixel-border bg-card transition-all hover:shadow-xl">
                <div className="aspect-video overflow-hidden">
                  <Image
                    src="/images/dino.jpg"
                    alt="Dino Game"
                    width={700}
                    height={400}
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-6 flex flex-col h-[200px]">
                  <h3 className="font-pixel text-xl text-game-orange mb-2 uppercase">DINO GAME</h3>
                  <p className="font-pixel text-xs text-muted-foreground mb-4 uppercase">
                    {dict.games.dino.description}
                  </p>
                  <div className="flex flex-col space-y-3 mt-auto">
                    <div className="flex justify-between items-center">
                      <GameButtons
                        gameType={GameType.DINO}
                        buttonText={`${dict.common.play} DINO RUN`}
                      />
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="font-pixel border border-game-orange text-game-orange hover:bg-game-orange/10 hover:text-game-orange ml-2 flex items-center self-center h-9"
                      >
                        <Link className="uppercase" href="/games#dino">
                          {dict.home.gamerules} &gt;
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 md:py-20 lg:py-24 bg-game-dark">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center mb-12">
              <h2 className="font-pixel text-2xl md:text-3xl text-game-blue uppercase">{dict.home.features.title}</h2>
              <div className="w-20 h-1 bg-game-blue"></div>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center space-y-2 p-6 bg-card rounded-lg pixel-border hover:transform hover:scale-105 transition-transform">
                <div className="p-2 bg-game-blue/20 rounded-full">
                  <Bell className="text-game-blue h-6 w-6" strokeWidth={2} />
                </div>
                <h3 className="font-pixel text-base uppercase">{dict.home.features.multiplayer.title}</h3>
                <p className="font-pixel text-xs text-muted-foreground uppercase">
                  {dict.home.features.multiplayer.description}
                </p>
              </div>

              <div className="flex flex-col items-center text-center space-y-2 p-6 bg-card rounded-lg pixel-border hover:transform hover:scale-105 transition-transform">
                <div className="p-2 bg-game-orange/20 rounded-full">
                  <BarChart3 className="text-game-orange h-6 w-6" strokeWidth={2} />
                </div>
                <h3 className="font-pixel text-base uppercase">{dict.home.features.stats.title}</h3>
                <p className="font-pixel text-xs text-muted-foreground uppercase">
                  {dict.home.features.stats.description}
                </p>
              </div>

              <div className="flex flex-col items-center text-center space-y-2 p-6 bg-card rounded-lg pixel-border sm:col-span-2 md:col-span-1 hover:transform hover:scale-105 transition-transform">
                <div className="p-2 bg-game-red/20 rounded-full">
                  <Settings className="text-game-red h-6 w-6" strokeWidth={2} />
                </div>
                <h3 className="font-pixel text-base uppercase">{dict.home.features.customization.title}</h3>
                <p className="font-pixel text-xs text-muted-foreground uppercase">
                  {dict.home.features.customization.description}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
