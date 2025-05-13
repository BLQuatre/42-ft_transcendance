import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { ArrowRight, Gamepad2, Trophy, Users } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainNav />

      <main className="flex-1">
        {/* Games Section */}
        <section className="py-12 md:py-24 lg:py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center mb-12">
              <h2 className="font-pixel text-2xl md:text-4xl text-game-orange">OUR GAMES</h2>
              <div className="w-20 h-1 bg-game-orange"></div>
              <p className="max-w-3xl text-muted-foreground font-pixel text-sm">
                EXPLORE OUR COLLECTION OF RETRO-INSPIRED ARCADE GAMES. EACH GAME OFFERS UNIQUE GAMEPLAY AND CHALLENGES.
              </p>
            </div>

            {/* Pong Game Feature */}
            <div className="mb-20" id="pong">
              <div className="rounded-xl pixel-border bg-card overflow-hidden">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="p-8 md:p-10 flex flex-col justify-center">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-game-blue/20 text-game-blue font-pixel text-xs mb-4 w-fit">
                      <Gamepad2 className="mr-2 h-4 w-4" />
                      CLASSIC ARCADE
                    </div>
                    <h3 className="font-pixel text-3xl text-game-blue mb-4">PONG</h3>
                    <div className="space-y-4 mb-6">
                      <p className="font-pixel text-sm">
                        THE ORIGINAL TABLE TENNIS SIMULATION GAME THAT STARTED THE VIDEO GAME REVOLUTION.
                      </p>

                      <div className="space-y-2">
                        <h4 className="font-pixel text-lg text-game-blue">HOW TO PLAY:</h4>
                        <ul className="space-y-2 font-pixel text-xs text-muted-foreground">
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>
                              MOVE YOUR PADDLE UP AND DOWN USING THE W/S KEYS (PLAYER 1) OR UP/DOWN ARROWS (PLAYER 2)
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>HIT THE BALL WITH YOUR PADDLE TO SEND IT BACK TO YOUR OPPONENT</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>SCORE POINTS WHEN YOUR OPPONENT MISSES THE BALL</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>FIRST PLAYER TO REACH 10 POINTS WINS THE GAME</span>
                          </li>
                        </ul>
                      </div>

                      <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex items-center gap-2 font-pixel text-xs">
                          <Users className="h-4 w-4 text-game-blue" />
                          <span>2 PLAYERS</span>
                        </div>
                        <div className="flex items-center gap-2 font-pixel text-xs">
                          <Trophy className="h-4 w-4 text-game-blue" />
                          <span>COMPETITIVE</span>
                        </div>
                      </div>
                    </div>

                    <Button asChild className="font-pixel bg-game-blue hover:bg-game-blue/90 w-fit mt-2">
                      <Link href="/games/pong" className="flex items-center">
                        PLAY PONG
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <div className="aspect-auto overflow-hidden bg-black/5">
                    <Image
                      src="https://upload.wikimedia.org/wikipedia/commons/f/f8/Pong.png"
                      alt="Pong Game"
                      width={800}
                      height={600}
                      className="object-cover h-full w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Dino Game Feature */}
            <div id="dino">
              <div className="rounded-xl pixel-border bg-card overflow-hidden">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="order-2 md:order-1 aspect-auto overflow-hidden bg-black/5">
                    <Image
                      src="https://archive.org/download/dino-run/dino-run.jpg"
                      alt="Dino Game"
                      width={800}
                      height={600}
                      className="object-cover h-full w-full"
                    />
                  </div>
                  <div className="order-1 md:order-2 p-8 md:p-10 flex flex-col justify-center">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-game-orange/20 text-game-orange font-pixel text-xs mb-4 w-fit">
                      <Gamepad2 className="mr-2 h-4 w-4" />
                      ENDLESS RUNNER
                    </div>
                    <h3 className="font-pixel text-3xl text-game-orange mb-4">DINO RUN</h3>
                    <div className="space-y-4 mb-6">
                      <p className="font-pixel text-sm">
                        A CHALLENGING ENDLESS RUNNER WHERE YOU CONTROL A DINOSAUR AVOIDING OBSTACLES IN A PREHISTORIC
                        LANDSCAPE.
                      </p>

                      <div className="space-y-2">
                        <h4 className="font-pixel text-lg text-game-orange">HOW TO PLAY:</h4>
                        <ul className="space-y-2 font-pixel text-xs text-muted-foreground">
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>PRESS SPACE BAR OR UP ARROW TO JUMP OVER CACTI AND OTHER OBSTACLES</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>PRESS DOWN ARROW TO DUCK UNDER FLYING PTERODACTYLS</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>THE GAME SPEEDS UP OVER TIME, MAKING IT INCREASINGLY DIFFICULT</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>YOUR SCORE INCREASES THE LONGER YOU SURVIVE</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>TRY TO BEAT YOUR HIGH SCORE WITH EACH ATTEMPT</span>
                          </li>
                        </ul>
                      </div>

                      <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex items-center gap-2 font-pixel text-xs">
                          <Users className="h-4 w-4 text-game-orange" />
                          <span>1 PLAYER</span>
                        </div>
                        <div className="flex items-center gap-2 font-pixel text-xs">
                          <Trophy className="h-4 w-4 text-game-orange" />
                          <span>HIGH SCORE CHALLENGE</span>
                        </div>
                      </div>
                    </div>

                    <Button asChild className="font-pixel bg-game-orange hover:bg-game-orange/90 w-fit mt-2">
                      <Link href="/games/dino" className="flex items-center">
                        PLAY DINO RUN
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
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
