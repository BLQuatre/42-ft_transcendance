"use client"

import { useEffect, useRef, useState } from "react"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function PongGamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [score, setScore] = useState({ player1: 0, player2: 0 })

  const startGame = () => {
    setGameStarted(true)
    setScore({ player1: 0, player2: 0 })
  }

  useEffect(() => {
    if (!gameStarted || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Game variables
    const paddleHeight = 80
    const paddleWidth = 10
    const ballSize = 10
    let ballX = canvas.width / 2
    let ballY = canvas.height / 2
    let ballSpeedX = 5
    let ballSpeedY = 3
    let paddle1Y = (canvas.height - paddleHeight) / 2
    let paddle2Y = (canvas.height - paddleHeight) / 2
    const paddleSpeed = 8

    // Controls
    const keys = { w: false, s: false, up: false, down: false }

    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === "w") keys.w = true
      if (e.key === "s") keys.s = true
      if (e.key === "ArrowUp") keys.up = true
      if (e.key === "ArrowDown") keys.down = true
    }

    const keyUpHandler = (e: KeyboardEvent) => {
      if (e.key === "w") keys.w = false
      if (e.key === "s") keys.s = false
      if (e.key === "ArrowUp") keys.up = false
      if (e.key === "ArrowDown") keys.down = false
    }

    window.addEventListener("keydown", keyDownHandler)
    window.addEventListener("keyup", keyUpHandler)

    // Game loop
    const gameLoop = () => {
      // Clear canvas
      ctx.fillStyle = "#1E1E1E"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw center line
      ctx.strokeStyle = "#333"
      ctx.setLineDash([10, 10])
      ctx.beginPath()
      ctx.moveTo(canvas.width / 2, 0)
      ctx.lineTo(canvas.width / 2, canvas.height)
      ctx.stroke()
      ctx.setLineDash([])

      // Update paddle positions
      if (keys.w && paddle1Y > 0) paddle1Y -= paddleSpeed
      if (keys.s && paddle1Y < canvas.height - paddleHeight) paddle1Y += paddleSpeed
      if (keys.up && paddle2Y > 0) paddle2Y -= paddleSpeed
      if (keys.down && paddle2Y < canvas.height - paddleHeight) paddle2Y += paddleSpeed

      // Draw paddles
      ctx.fillStyle = "#4A9DFF"
      ctx.fillRect(0, paddle1Y, paddleWidth, paddleHeight)
      ctx.fillStyle = "#FFA500"
      ctx.fillRect(canvas.width - paddleWidth, paddle2Y, paddleWidth, paddleHeight)

      // Update ball position
      ballX += ballSpeedX
      ballY += ballSpeedY

      // Ball collision with top and bottom
      if (ballY <= 0 || ballY >= canvas.height - ballSize) {
        ballSpeedY = -ballSpeedY
      }

      // Ball collision with paddles
      if (
        (ballX <= paddleWidth && ballY >= paddle1Y && ballY <= paddle1Y + paddleHeight) ||
        (ballX >= canvas.width - paddleWidth - ballSize && ballY >= paddle2Y && ballY <= paddle2Y + paddleHeight)
      ) {
        ballSpeedX = -ballSpeedX
      }

      // Ball out of bounds
      if (ballX < 0) {
        // Player 2 scores
        setScore((prev) => ({ ...prev, player2: prev.player2 + 1 }))
        ballX = canvas.width / 2
        ballY = canvas.height / 2
        ballSpeedX = -ballSpeedX
      } else if (ballX > canvas.width) {
        // Player 1 scores
        setScore((prev) => ({ ...prev, player1: prev.player1 + 1 }))
        ballX = canvas.width / 2
        ballY = canvas.height / 2
        ballSpeedX = -ballSpeedX
      }

      // Draw ball
      ctx.fillStyle = "#FFFFFF"
      ctx.fillRect(ballX, ballY, ballSize, ballSize)

      // Draw score
      ctx.font = '16px "Press Start 2P"'
      ctx.fillStyle = "#4A9DFF"
      ctx.fillText(score.player1.toString(), canvas.width / 4, 30)
      ctx.fillStyle = "#FFA500"
      ctx.fillText(score.player2.toString(), (canvas.width / 4) * 3, 30)

      if (gameStarted) {
        requestAnimationFrame(gameLoop)
      }
    }

    const animationId = requestAnimationFrame(gameLoop)

    return () => {
      window.removeEventListener("keydown", keyDownHandler)
      window.removeEventListener("keyup", keyUpHandler)
      cancelAnimationFrame(animationId)
    }
  }, [gameStarted, score])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainNav />

      <div className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="font-pixel text-2xl md:text-3xl mb-2">PONG</h1>
          <p className="font-pixel text-xs text-muted-foreground">THE CLASSIC TABLE TENNIS GAME</p>
        </div>

        <div className="grid gap-8 md:grid-cols-[1fr_300px]">
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <canvas ref={canvasRef} width={800} height={500} className="w-full h-auto bg-game-dark pixel-border" />
              </CardContent>
              <CardFooter className="flex justify-between p-4">
                <div className="font-pixel text-sm">
                  <span className="text-game-blue">{score.player1}</span>
                  {" - "}
                  <span className="text-game-orange">{score.player2}</span>
                </div>
                <Button onClick={startGame} className="font-pixel bg-game-blue hover:bg-game-blue/90">
                  {gameStarted ? "RESTART" : "START GAME"}
                </Button>
              </CardFooter>
            </Card>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="font-pixel text-sm">CONTROLS</AlertTitle>
              <AlertDescription className="font-pixel text-xs">
                PLAYER 1: W (UP) AND S (DOWN) <br />
                PLAYER 2: ARROW UP AND ARROW DOWN
              </AlertDescription>
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
                    <p className="font-pixel text-xs">1. PLAYER_ONE</p>
                    <p className="font-pixel text-xs">120 PTS</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="font-pixel text-xs">2. GAMER42</p>
                    <p className="font-pixel text-xs">98 PTS</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="font-pixel text-xs">3. RETRO_FAN</p>
                    <p className="font-pixel text-xs">87 PTS</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="font-pixel text-xs">4. PIXEL_MASTER</p>
                    <p className="font-pixel text-xs">65 PTS</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="font-pixel text-xs">5. ARCADE_PRO</p>
                    <p className="font-pixel text-xs">52 PTS</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-pixel text-sm">YOUR STATS</CardTitle>
                <CardDescription className="font-pixel text-xs">YOUR PONG PERFORMANCE</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="font-pixel text-xs">GAMES PLAYED</p>
                    <p className="font-pixel text-xs">76</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="font-pixel text-xs">WINS</p>
                    <p className="font-pixel text-xs">48</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="font-pixel text-xs">LOSSES</p>
                    <p className="font-pixel text-xs">28</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="font-pixel text-xs">WIN RATE</p>
                    <p className="font-pixel text-xs">63%</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="font-pixel text-xs">HIGHEST SCORE</p>
                    <p className="font-pixel text-xs">15-3</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="font-pixel text-sm">RECENT GAMES</CardTitle>
                <CardDescription className="font-pixel text-xs">YOUR LATEST PONG MATCHES</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-muted rounded-md">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-game-green"></div>
                      <p className="font-pixel text-xs">VS. GAMER42</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <p className="font-pixel text-xs text-game-blue">10-5</p>
                      <p className="font-pixel text-xs text-muted-foreground">04/20/2023</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-2 bg-muted rounded-md">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-game-green"></div>
                      <p className="font-pixel text-xs">VS. PIXEL_MASTER</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <p className="font-pixel text-xs text-game-blue">10-8</p>
                      <p className="font-pixel text-xs text-muted-foreground">04/18/2023</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-2 bg-muted rounded-md">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-game-red"></div>
                      <p className="font-pixel text-xs">VS. RETRO_FAN</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <p className="font-pixel text-xs text-game-red">7-10</p>
                      <p className="font-pixel text-xs text-muted-foreground">04/15/2023</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-2 bg-muted rounded-md">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-game-green"></div>
                      <p className="font-pixel text-xs">VS. ARCADE_PRO</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <p className="font-pixel text-xs text-game-blue">10-2</p>
                      <p className="font-pixel text-xs text-muted-foreground">04/12/2023</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-2 bg-muted rounded-md">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-game-green"></div>
                      <p className="font-pixel text-xs">VS. JUMP_MASTER</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <p className="font-pixel text-xs text-game-blue">10-6</p>
                      <p className="font-pixel text-xs text-muted-foreground">04/10/2023</p>
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
