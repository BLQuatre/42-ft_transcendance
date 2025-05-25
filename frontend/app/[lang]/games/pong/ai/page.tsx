"use client"

import { useEffect, useRef, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { MainNav } from "@/components/Navbar"
import { Card, CardContent } from "@/components/ui/Card"
import { ScoreDisplay } from "@/components/ScoreDisplay"
import { BaseUser } from "@/types/user"
import api from "@/lib/api"
import { useDictionary } from "@/hooks/UseDictionnary"

import { Game } from '@/lib/pong/game'
import * as CONST from '@/lib/pong/constants' ;


export default function PongGamePage() {
	const { accessToken } = useAuth()
	const dict = useDictionary()

	const playerId = localStorage.getItem('userId')
	const userRef = useRef<BaseUser | null>(null)
	useEffect(() => {
		api.get(`/user/${playerId}`).then(response => {
			userRef.current = response.data.user;
		});
	}, []);


	const canvasRef = useRef<HTMLCanvasElement>(null)
	const [pausedState, setPausedState] = useState<boolean>(true)
	const pausedRef = useRef(pausedState)
	const [gameFinished, setGameFinished] = useState<boolean>(false)
	const gameFinishedRef = useRef(gameFinished)
	const submittedRef = useRef(false)

	let keysPressed = { up: false, down: false }
	const gameRef = useRef<Game | null>(null)
	const frameRef = useRef<number | null>(null)
	const [scores, setScores] = useState({ left: 0, right: 0 })


	let bot = { knownBallY: 0, inputs: { up: false, down: false } }


	useEffect(() => {
		if (!gameRef.current) gameRef.current = new Game()
	}, [])

	useEffect(() => {
		gameFinishedRef.current = gameFinished

		if (gameFinished === true) setPausedState(true)
	}, [gameFinished])

	useEffect(() => {
		const game = gameRef.current!
		pausedRef.current = pausedState

		if (pausedState === true)	game.stopUpdating()
		else						game.startUpdating()
	}, [pausedState])

	useEffect(() => {
		const intervalId = setInterval(() => {
			const ball = gameRef.current!.get_ball()

			// Predict 1s into the future
			let predictedY = ball.y + ball.vy * CONST.FPS

			// Adjust prediction in case of bounce
			if (predictedY > canvasRef.current!.height)
				predictedY = canvasRef.current!.height - (predictedY - canvasRef.current!.height)
			if (predictedY < 0)
				predictedY = -predictedY

			// Use prediction, unless ball is already going straight to the paddle
			bot.knownBallY = (ball.x > ((canvasRef.current?.width ?? 800) - 100) && Math.abs(ball.vy) < 1) ? ball.y : predictedY
		}, 1000)

		return () => clearInterval(intervalId)
	}, [])


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
		}

		const handleInput = () => {
			if (pausedRef.current === true) return

			// player
			if (keysPressed.up)
				game.get_Lplayer().move(true)
			if (keysPressed.down)
				game.get_Lplayer().move(false)


			// Bot
			const botPaddle = game.get_Rplayer().get_paddle()
			const paddleCenter = (botPaddle.top + botPaddle.bot) / 2

			// Move continuously toward last known ball position
			if (Math.abs(bot.knownBallY - paddleCenter) > 10) {
				bot.inputs.up = bot.knownBallY < paddleCenter
				bot.inputs.down = bot.knownBallY > paddleCenter
			} else {
				bot.inputs.up = false
				bot.inputs.down = false
			}

			if (bot.inputs.up)
				game.get_Rplayer().move(true)
			if (bot.inputs.down)
				game.get_Rplayer().move(false)
		}


		const gameLoop = () => {
			draw()
			handleInput()

			const currentScores = game.get_score()
			if (currentScores.left !== scores.left || currentScores.right !== scores.right) {
				setScores({ left: currentScores.left, right: currentScores.right })
			}

			if ((game.get_score().left == CONST.SCORE_WIN || game.get_score().right == CONST.SCORE_WIN) && !submittedRef.current) {
				setGameFinished(true) ;

				const user = userRef.current ;
				if (accessToken && user) {
					submittedRef.current = true ;

					api.post('/history', {
						game_type: 'PONG',
						players: [{
							user_id: localStorage.getItem("userId"),
							username: user.name,
							is_bot: false,
							score: currentScores.left,
							is_winner: currentScores.left === CONST.SCORE_WIN
						}, {
							username: 'AI',
							is_bot: true,
							score: currentScores.right,
							is_winner: currentScores.right === CONST.SCORE_WIN
						}]
					}) ;
				}
			}

			if (gameFinishedRef.current === false)
				frameRef.current = requestAnimationFrame(gameLoop)
		}
		frameRef.current = requestAnimationFrame(gameLoop)



		const keydown = (e: KeyboardEvent) => {
			if (e.key === "w" || e.key === "ArrowUp")	keysPressed.up = true
			if (e.key === "s" || e.key === "ArrowDown")	keysPressed.down = true

			if (e.key === "p" && gameFinishedRef.current === false) setPausedState((prev) => !prev)
		}
		const keyup = (e: KeyboardEvent) => {
			if (e.key === "w" || e.key === "ArrowUp")	keysPressed.up = false
			if (e.key === "s" || e.key === "ArrowDown")	keysPressed.down = false
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

								{/* Blur overlay applied only to game area */}
								{pausedState && <div className="absolute inset-0 z-10" style={{ backdropFilter: "blur(8px)" }}></div>}

								{/* Score display component */}
								<ScoreDisplay
									leftScore={scores.left}
									rightScore={scores.right}
									winningScore={CONST.SCORE_WIN}
									gameFinished={gameFinished}
								/>

								{/* Pause instructions on top of blur */}
								{(pausedState && !gameFinished) && (
									<div className="absolute inset-0 flex flex-col items-center justify-center z-20">
										<div className="text-white text-center">
											<h2 className="text-3xl font-bold mb-4 animate-pulse">
												{dict?.games?.pong?.pauseInstructions || "Press P to play/pause"}
											</h2>
											<div className="text-sm opacity-80">
												<p>{dict?.games?.pong?.moveInstructions || "Use ↑/↓ or W/S to move your paddle"}</p>
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
