"use client"

import { useEffect, useRef, useState } from "react"
import { MainNav } from "@/components/main-nav"
import { Card, CardContent } from "@/components/ui/card"

import { Game } from './game'

export default function PongGamePage() {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const [pausedState, setPausedState] = useState<boolean>(true)
	const pausedRef = useRef(pausedState)

	let keysPressed = { w: false, s: false, up: false, down: false } ;
	const gameRef = useRef<Game | null>(null)
	const frameRef = useRef<number | null>(null)


	useEffect(() => {
		if (!gameRef.current)
			gameRef.current = new Game()
	}, [])


	useEffect(() => {
		const game = gameRef.current!
		pausedRef.current = pausedState

		if (pausedState === true)
			game.stopUpdating()
		else
			game.startUpdating()
	}, [pausedState])


	useEffect(() => {
		if (!canvasRef.current) return

		const canvas = canvasRef.current
		const ctx = canvas.getContext("2d")
		if (!ctx) return

		const game = gameRef.current!


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
			ctx.fillRect(canvas.width - (offset * 2), Rpaddle.top, offset, Rpaddle.bot - Rpaddle.top)


			// Draw ball
			const ball = game.get_ball()
			ctx.beginPath()
			ctx.fillStyle = "#FFFFFF"
			ctx.arc(ball.x, ball.y, 10, 0, Math.PI * 2)
			ctx.fill()


			// Draw score
			ctx.font = '16px "Press Start 2P"'

			const score = game.get_score() ;
			ctx.fillStyle = "#4A9DFF"
			ctx.fillText(score.left.toString(), canvas.width / 4, 30)
			ctx.fillStyle = "#FFA500"
			ctx.fillText(score.right.toString(), (canvas.width / 4) * 3, 30)
		}

		const handleInput = () => {
			if (pausedRef.current === true) return ;

			// left player
			if (keysPressed.w)
				game.get_Lplayer().move(true) ;
			if (keysPressed.s)
				game.get_Lplayer().move(false) ;
			// right player
			if (keysPressed.up)
				game.get_Rplayer().move(true) ;
			if (keysPressed.down)
				game.get_Rplayer().move(false) ;
		}


		const gameLoop = () => {
			draw()
			handleInput()
			frameRef.current = requestAnimationFrame(gameLoop)
		}
		frameRef.current = requestAnimationFrame(gameLoop)



		const keydown = (e: KeyboardEvent) => {
			if (e.key === "w")			keysPressed.w = true
			if (e.key === "s")			keysPressed.s = true
			if (e.key === "ArrowUp")	keysPressed.up = true
			if (e.key === "ArrowDown")	keysPressed.down = true

			if (e.key === "p") setPausedState(prev => !prev)
		}
		const keyup = (e: KeyboardEvent) => {
			if (e.key === "w")			keysPressed.w = false
			if (e.key === "s")			keysPressed.s = false
			if (e.key === "ArrowUp")	keysPressed.up = false
			if (e.key === "ArrowDown")	keysPressed.down = false
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

			<div className="flex-1 container py-6">
				<div className="grid gap-8">
					<div className="space-y-4">
						<Card className="overflow-hidden">
							<CardContent className="p-0">
								<canvas
									ref={canvasRef}
									width={800}
									height={500}
									className="w-full h-auto bg-game-dark pixel-border"
								/>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	)
}
