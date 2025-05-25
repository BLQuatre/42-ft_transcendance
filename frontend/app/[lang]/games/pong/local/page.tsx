"use client"

import { useEffect, useRef, useState } from "react"
import { MainNav } from "@/components/Navbar"
import { Card, CardContent } from "@/components/ui/Card"
import { ScoreDisplay } from "@/components/ScoreDisplay"
import { useDictionary } from "@/hooks/UseDictionnary"

import { Game } from "@/lib/pong/game"
import * as CONST from "@/lib/pong/constants"

export default function PongGamePage() {
  const dict = useDictionary()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [pausedState, setPausedState] = useState<boolean>(true)
  const pausedRef = useRef(pausedState)
  const [gameFinished, setGameFinished] = useState<boolean>(false)
  const gameFinishedRef = useRef(gameFinished)

  const keysPressed = { w: false, s: false, up: false, down: false }
  const gameRef = useRef<Game | null>(null)
  const [scores, setScores] = useState({ left: 0, right: 0 })
  const frameRef = useRef<number | null>(null)


  useEffect(() => {
    if (!gameRef.current) {
      gameRef.current = new Game()
    }
  }, [])

  useEffect(() => {
    gameFinishedRef.current = gameFinished

    if (gameFinished === true) setPausedState(true)
  }, [gameFinished])

  useEffect(() => {
	if (!gameRef.current) return;

    const game = gameRef.current
    pausedRef.current = pausedState

    if (pausedState === true) game.stopUpdating()
    else game.startUpdating()
  }, [pausedState])

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

	if (!gameRef.current) return;

    const game = gameRef.current

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = "#1E1E1E"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Center dashed line
      ctx.strokeStyle = "#333"
      ctx.setLineDash([10, 10])
      ctx.beginPath()
      ctx.moveTo(canvas.width / 2, 0)
      ctx.lineTo(canvas.width / 2, canvas.height)
      ctx.stroke()
      ctx.setLineDash([])

      // Draw paddles
      const offset = 20

      const Lpaddle = game.get_Lplayer().get_paddle()
      ctx.fillStyle = "#4A9DFF"
      ctx.fillRect(offset, Lpaddle.top, offset, Lpaddle.bot - Lpaddle.top)

      const Rpaddle = game.get_Rplayer().get_paddle()
      ctx.fillStyle = "#FFA500"
      ctx.fillRect(canvas.width - offset * 2, Rpaddle.top, offset, Rpaddle.bot - Rpaddle.top)

      // Draw ball
      const ball = game.get_ball()
      ctx.beginPath()
      ctx.fillStyle = "#FFFFFF"
      ctx.arc(ball.x, ball.y, 10, 0, Math.PI * 2)
      ctx.fill()
    }

    const handleInput = () => {
      if (pausedRef.current === true) return

      // left player
      if (keysPressed.w) game.get_Lplayer().move(true)
      if (keysPressed.s) game.get_Lplayer().move(false)
      // right player
      if (keysPressed.up) game.get_Rplayer().move(true)
      if (keysPressed.down) game.get_Rplayer().move(false)
    }

    const gameLoop = () => {
	  draw()
	  handleInput()

	  const currentScores = game.get_score()
      if (currentScores.left !== scores.left || currentScores.right !== scores.right) {
        setScores({ left: currentScores.left, right: currentScores.right })
      }

      if (game.get_score().left == CONST.SCORE_WIN || game.get_score().right == CONST.SCORE_WIN) setGameFinished(true)

      if (gameFinishedRef.current === false) frameRef.current = requestAnimationFrame(gameLoop)
    }
    frameRef.current = requestAnimationFrame(gameLoop)

    const keydown = (e: KeyboardEvent) => {
      if (e.key === "w") keysPressed.w = true
      if (e.key === "s") keysPressed.s = true
      if (e.key === "ArrowUp") keysPressed.up = true
      if (e.key === "ArrowDown") keysPressed.down = true

      if (e.key === "p" && gameFinishedRef.current === false) setPausedState((prev) => !prev)
    }
    const keyup = (e: KeyboardEvent) => {
      if (e.key === "w") keysPressed.w = false
      if (e.key === "s") keysPressed.s = false
      if (e.key === "ArrowUp") keysPressed.up = false
      if (e.key === "ArrowDown") keysPressed.down = false
    }

    window.addEventListener("keydown", keydown)
    window.addEventListener("keyup", keyup)

    return () => {
      cancelAnimationFrame(frameRef.current!)
      window.removeEventListener("keydown", keydown)
      window.removeEventListener("keyup", keyup)
    }
  }, [])

  return (
    <div className="min-h-screen bg-background flex flex-col h-screen overflow-hidden">
      <MainNav />

      <div className="flex-1 container py-6 relative">
        <div className="grid gap-8 relative">
          <div className="space-y-4">
            <Card className="overflow-hidden relative">
              <CardContent className="p-0">
                <canvas ref={canvasRef} width={800} height={500} className="w-full h-auto bg-game-dark pixel-border" />

                {/* Score display component */}
                <ScoreDisplay
                  leftScore={scores.left}
                  rightScore={scores.right}
                  winningScore={CONST.SCORE_WIN}
                  gameFinished={gameFinished}
                />

                {/* Blur overlay applied only to game area */}
                {pausedState && <div className="absolute inset-0 z-10" style={{ backdropFilter: "blur(8px)" }}></div>}

                {/* Pause instructions on top of blur */}
                {pausedState && !gameFinished && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                    <div className="text-white text-center">
                      <h2 className="text-3xl font-bold mb-4 animate-pulse">
                        {dict && dict.games && dict.games.pong && dict.games.pong.pauseInstructions}
                      </h2>
                      <div className="text-sm opacity-80">
                        <p>{dict && dict.games && dict.games.pong && dict.games.pong.leftPaddleInstructions}</p>
                        <p>{dict && dict.games && dict.games.pong && dict.games.pong.rightPaddleInstructions}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
