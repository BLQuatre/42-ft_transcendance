import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { getDictionary } from "@/lib/dictionnaries"
import { Language } from "@/types/types"

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
              <h2 className="font-pixel text-2xl md:text-4xl text-game-orange animate-pulse uppercase">{dict.home.games}</h2>
              <div className="w-32 h-1 bg-game-orange"></div>
              <p className="font-pixel text-sm md:text-base text-muted-foreground max-w-[700px] mx-auto uppercase">
                {dict.home.description}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              {/* Pong Game */}
              <div className="group relative overflow-hidden rounded-lg pixel-border bg-card transition-all hover:shadow-xl">
                <div className="aspect-video overflow-hidden">
                  <Link href="/games/pong">
                  <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/f/f8/Pong.png"
                    alt="Pong Game"
                    width={700}
                    height={400}
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  </Link>
                </div>
                <div className="p-6">
                  <h3 className="font-pixel text-xl text-game-blue mb-2 uppercase">{dict.games.pong.title}</h3>
                  <p className="font-pixel text-xs text-muted-foreground mb-4 uppercase">
                    {dict.games.pong.description}
                  </p>
                  <div className="flex flex-wrap justify-between items-center">
                    <Button asChild className="font-pixel bg-game-blue hover:bg-game-blue/90 min-w-28">
                      <Link href="/games/pong" className="uppercase">{dict.common.play} {dict.games.pong.title}</Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="font-pixel border border-game-blue text-game-blue hover:bg-game-blue/10 hover:text-game-blue"
                    >
                      <Link href="/games#pong">GAME RULES &gt;</Link>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Dino Game */}
              <div className="group relative overflow-hidden rounded-lg pixel-border bg-card transition-all hover:shadow-xl">
                <div className="aspect-video overflow-hidden">
                  <Link href="/games/dino">
                  <Image
                    src="https://archive.org/download/dino-run/dino-run.jpg"
                    alt="Dino Game"
                    width={700}
                    height={400}
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  </Link>
                </div>
                <div className="p-6">
                  <h3 className="font-pixel text-xl text-game-orange mb-2 uppercase">{dict.games.dino.title}</h3>
                  <p className="font-pixel text-xs text-muted-foreground mb-4 uppercase">
                    {dict.games.dino.description}
                  </p>
                  <div className="flex flex-wrap justify-between items-center">
                    <Button asChild className="font-pixel bg-game-orange hover:bg-game-orange/90 min-w-28">
                      <Link href="/games/dino" className="uppercase">{dict.common.play} {dict.games.dino.title}</Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="font-pixel border border-game-orange text-game-orange hover:bg-game-orange/10 hover:text-game-orange"
                    >
                      <Link href="/games#dino">GAME RULES &gt;</Link>
                    </Button>
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
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                </div>
                <h3 className="font-pixel text-base uppercase">
                  {dict.home.features.multiplayer.title}
                </h3>
                <p className="font-pixel text-xs text-muted-foreground uppercase">
                  {dict.home.features.multiplayer.description}
                </p>
              </div>

              <div className="flex flex-col items-center text-center space-y-2 p-6 bg-card rounded-lg pixel-border hover:transform hover:scale-105 transition-transform">
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
                    <path d="M12 20v-6M6 20V10M18 20V4"></path>
                  </svg>
                </div>
                <h3 className="font-pixel text-base uppercase">{dict.home.features.stats.title}</h3>
                <p className="font-pixel text-xs text-muted-foreground uppercase">{dict.home.features.stats.description}</p>
              </div>

              <div className="flex flex-col items-center text-center space-y-2 p-6 bg-card rounded-lg pixel-border sm:col-span-2 md:col-span-1 hover:transform hover:scale-105 transition-transform">
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
                    <path d="M20 7h-9"></path>
                    <path d="M14 17H5"></path>
                    <circle cx="17" cy="17" r="3"></circle>
                    <circle cx="7" cy="7" r="3"></circle>
                  </svg>
                </div>
                <h3 className="font-pixel text-base uppercase">
                  {dict.home.features.customization.title}
                </h3>
                <p className="font-pixel text-xs text-muted-foreground uppercase">
                  {dict.home.features.customization.description}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer dict={dict} />
    </div>
  )
}
