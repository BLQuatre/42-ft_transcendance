"use client"

import { useEffect, useRef, useState } from "react"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function DinoGamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)

  const startGame = () => {
    setGameStarted(true)
    setScore(0)
  }

  useEffect(() => {
    if (!gameStarted || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Game variables
    const dinoHeight = 60
    const dinoWidth = 40
    let dinoY = canvas.height - dinoHeight - 20
    const dinoX = 50
    let jumping = false
    let jumpHeight = 0
    const gravity = 1
    const jumpPower = 15

    // Obstacles
    const obstacles: { x: number; width: number; height: number }[] = []
    const obstacleSpeed = 5
    const obstacleWidth = 20
    const minObstacleHeight = 30
    const maxObstacleHeight = 70
    let obstacleTimer = 0

    // Game state
    let gameOver = false
    let animationId: number
    let currentScore = 0

    // Controls
    const keyDownHandler = (e: KeyboardEvent) => {
      if ((e.key === " " || e.key === "ArrowUp") && !jumping) {
        jumping = true
        jumpHeight = jumpPower
      }
    }

    window.addEventListener("keydown", keyDownHandler)

    // Game loop
    const gameLoop = () => {
      // Clear canvas
      ctx.fillStyle = "#1E1E1E"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw ground
      ctx.fillStyle = "#333"
      ctx.fillRect(0, canvas.height - 20, canvas.width, 20)

      // Update dino position
      if (jumping) {
        dinoY -= jumpHeight
        jumpHeight -= gravity

        if (dinoY >= canvas.height - dinoHeight - 20) {
          dinoY = canvas.height - dinoHeight - 20
          jumping = false
        }
      }

      // Draw dino
      ctx.fillStyle = "#FFA500"
      ctx.fillRect(dinoX, dinoY, dinoWidth, dinoHeight)

      // Generate obstacles
      obstacleTimer++
      if (obstacleTimer > 100) {
        const height = Math.floor(Math.random() * (maxObstacleHeight - minObstacleHeight + 1)) + minObstacleHeight
        obstacles.push({
          x: canvas.width,
          width: obstacleWidth,
          height,
        })
        obstacleTimer = 0
      }

      // Update and draw obstacles
      for (let i = 0; i < obstacles.length; i++) {
        const obstacle = obstacles[i]
        obstacle.x -= obstacleSpeed

        // Draw obstacle
        ctx.fillStyle = "#4A9DFF"
        ctx.fillRect(obstacle.x, canvas.height - obstacle.height - 20, obstacle.width, obstacle.height)

        // Check collision
        if (
          dinoX < obstacle.x + obstacle.width &&
          dinoX + dinoWidth > obstacle.x &&
          dinoY < canvas.height - obstacle.height - 20 + obstacle.height &&
          dinoY + dinoHeight > canvas.height - obstacle.height - 20
        ) {
          gameOver = true
        }

        // Remove obstacles that are off screen
        if (obstacle.x + obstacle.width < 0) {
          obstacles.splice(i, 1)
          i--
          currentScore++
          setScore(currentScore)
        }
      }

      // Draw score
      ctx.font = '16px "Press Start 2P"'
      ctx.fillStyle = "#FFFFFF"
      ctx.fillText(`SCORE: ${currentScore}`, 20, 30)

      if (gameOver) {
        if (currentScore > highScore) {
          setHighScore(currentScore)
        }

        ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.font = '24px "Press Start 2P"'
        ctx.fillStyle = "#FF4D4D"
        ctx.fillText("GAME OVER", canvas.width / 2 - 100, canvas.height / 2 - 20)

        ctx.font = '16px "Press Start 2P"'
        ctx.fillStyle = "#FFFFFF"
        ctx.fillText(`SCORE: ${currentScore}`, canvas.width / 2 - 70, canvas.height / 2 + 20)

        setGameStarted(false)
        return
      }

      animationId = requestAnimationFrame(gameLoop)
    }

    animationId = requestAnimationFrame(gameLoop)

    return () => {
      window.removeEventListener("keydown", keyDownHandler)
      cancelAnimationFrame(animationId)
    }
  }, [gameStarted, highScore])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainNav />

      <div className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="font-pixel text-2xl md:text-3xl mb-2">DINO RUN</h1>
          <p className="font-pixel text-xs text-muted-foreground">
            JUMP OVER OBSTACLES AND SURVIVE AS LONG AS POSSIBLE
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-[1fr_300px]">
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <canvas ref={canvasRef} width={800} height={400} className="w-full h-auto bg-game-dark pixel-border" />
              </CardContent>
              <CardFooter className="flex justify-between p-4">
                <div className="font-pixel text-sm">
                  SCORE: <span className="text-game-orange">{score}</span>
                </div>
                <Button onClick={startGame} className="font-pixel bg-game-orange hover:bg-game-orange/90">
                  {gameStarted ? "RESTART" : "START GAME"}
                </Button>
              </CardFooter>
            </Card>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="font-pixel text-sm">CONTROLS</AlertTitle>
              <AlertDescription className="font-pixel text-xs">PRESS SPACE OR ARROW UP TO JUMP</AlertDescription>
            </Alert>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-pixel text-sm">LEADERBOARD</CardTitle>
                <CardDescription className="font-pixel text-xs">TOP PLAYERS THIS WEEK</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="font-pixel text-xs">1. PIXEL_MASTER</p>
                    <p className="font-pixel text-xs">1024 PTS</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="font-pixel text-xs">2. DINO_KING</p>
                    <p className="font-pixel text-xs">876 PTS</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="font-pixel text-xs">3. PLAYER_ONE</p>
                    <p className="font-pixel text-xs">753 PTS</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="font-pixel text-xs">4. JUMP_MASTER</p>
                    <p className="font-pixel text-xs">621 PTS</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="font-pixel text-xs">5. RETRO_FAN</p>
                    <p className="font-pixel text-xs">512 PTS</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-pixel text-sm">YOUR STATS</CardTitle>
                <CardDescription className="font-pixel text-xs">YOUR DINO RUN PERFORMANCE</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="font-pixel text-xs">GAMES PLAYED</p>
                    <p className="font-pixel text-xs">52</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="font-pixel text-xs">HIGH SCORE</p>
                    <p className="font-pixel text-xs">{highScore > 0 ? highScore : 753}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="font-pixel text-xs">AVERAGE SCORE</p>
                    <p className="font-pixel text-xs">512</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="font-pixel text-xs">TOTAL DISTANCE</p>
                    <p className="font-pixel text-xs">42km</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="font-pixel text-xs">OBSTACLES JUMPED</p>
                    <p className="font-pixel text-xs">1,248</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="font-pixel text-sm">RECENT RUNS</CardTitle>
                <CardDescription className="font-pixel text-xs">YOUR LATEST DINO RUN ATTEMPTS</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-muted rounded-md">
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
                      <p className="font-pixel text-xs">CLASSIC MAP</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <p className="font-pixel text-xs text-game-orange">753 PTS</p>
                      <p className="font-pixel text-xs text-muted-foreground">04/22/2023</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-2 bg-muted rounded-md">
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
                      <p className="font-pixel text-xs">CLASSIC MAP</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <p className="font-pixel text-xs text-game-orange">621 PTS</p>
                      <p className="font-pixel text-xs text-muted-foreground">04/20/2023</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-2 bg-muted rounded-md">
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
                      <p className="font-pixel text-xs">CLASSIC MAP</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <p className="font-pixel text-xs text-game-orange">542 PTS</p>
                      <p className="font-pixel text-xs text-muted-foreground">04/18/2023</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-2 bg-muted rounded-md">
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
                      <p className="font-pixel text-xs">CLASSIC MAP</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <p className="font-pixel text-xs text-game-orange">498 PTS</p>
                      <p className="font-pixel text-xs text-muted-foreground">04/15/2023</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-2 bg-muted rounded-md">
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
                      <p className="font-pixel text-xs">CLASSIC MAP</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <p className="font-pixel text-xs text-game-orange">412 PTS</p>
                      <p className="font-pixel text-xs text-muted-foreground">04/12/2023</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
