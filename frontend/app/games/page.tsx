import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainNav />

      <main className="flex-1">
        {/* Games Section */}
        <section className="py-12 md:py-24 lg:py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center mb-12">
              <h2 className="font-pixel text-2xl md:text-3xl text-game-orange">OUR GAMES</h2>
              <div className="w-20 h-1 bg-game-orange"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              {/* Pong Game */}
              <div className="group relative overflow-hidden rounded-lg pixel-border bg-card transition-all hover:shadow-xl">
                <div className="aspect-video overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    alt="Pong Game"
                    width={600}
                    height={400}
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-pixel text-xl text-game-blue mb-2">PONG</h3>
                  <p className="font-pixel text-xs text-muted-foreground mb-4">
                    THE CLASSIC TABLE TENNIS GAME. COMPETE WITH FRIENDS TO SEE WHO CAN SCORE THE MOST POINTS.
                  </p>
                  <Button asChild className="font-pixel bg-game-blue hover:bg-game-blue/90">
                    <Link href="/games/pong">PLAY PONG</Link>
                  </Button>
                </div>
              </div>

              {/* Dino Game */}
              <div className="group relative overflow-hidden rounded-lg pixel-border bg-card transition-all hover:shadow-xl">
                <div className="aspect-video overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    alt="Dino Game"
                    width={600}
                    height={400}
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-pixel text-xl text-game-orange mb-2">DINO RUN</h3>
                  <p className="font-pixel text-xs text-muted-foreground mb-4">
                    JUMP OVER OBSTACLES AND SURVIVE AS LONG AS POSSIBLE IN THIS ENDLESS RUNNER GAME.
                  </p>
                  <Button asChild className="font-pixel bg-game-orange hover:bg-game-orange/90">
                    <Link href="/games/dino">PLAY DINO</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
