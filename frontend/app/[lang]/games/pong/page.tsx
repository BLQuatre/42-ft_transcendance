"use client"

import { useEffect, useRef, useState } from "react"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { PongState } from "@/types/types" // Ensure this matches your backend types

export default function PongGamePage() {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const [gameStarted, setGameStarted] = useState(false)
	const [gameState, setGameState] = useState<PongState | null>(null)
	const [playerId, setPlayerId] = useState<number | null>(null)
	const socketRef = useRef<WebSocket | null>(null)

	const keysPressed = useRef({ up: false, down: false })

	const startGame = () => {
		setGameStarted(true)
	}

	useEffect(() => {
		const socket = new WebSocket("ws://localhost:3002")
		socketRef.current = socket

		socket.addEventListener("open", () => {
			console.log("Connected to game server")
		})

		socket.addEventListener("message", event => {
			const msg = JSON.parse(event.data)
			if (msg.type === "assign") setPlayerId(msg.playerId)
			if (msg.type === "state") setGameState(msg.gameState)
		})

		return () => {
			socket.close()
		}
	}, [])

	useEffect(() => {
		if (!gameStarted || !canvasRef.current) return

		const canvas = canvasRef.current
		const ctx = canvas.getContext("2d")
		if (!ctx) return

		const draw = () => {
			if (!gameState) return

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
			ctx.fillStyle = "#4A9DFF"
			gameState.left_team.players.forEach(player =>
				ctx.fillRect(20, player.top, 20, player.bot - player.top)
			)

			ctx.fillStyle = "#FFA500"
			gameState.right_team.players.forEach(player =>
				ctx.fillRect(760, player.top, 20, player.bot - player.top)
			)

			// Draw ball
			ctx.beginPath()
			ctx.fillStyle = "#FFFFFF"
			ctx.arc(gameState.ball.x, gameState.ball.y, 10, 0, Math.PI * 2)
			ctx.fill()

			// Draw score
			ctx.font = '16px "Press Start 2P"'
			ctx.fillStyle = "#4A9DFF"
			ctx.fillText(gameState.left_team.score.toString(), canvas.width / 4, 30)
			ctx.fillStyle = "#FFA500"
			ctx.fillText(gameState.right_team.score.toString(), (canvas.width / 4) * 3, 30)
		}

		const handleInput = () => {
			if (!playerId || !socketRef.current) return
			const socket = socketRef.current

			if (keysPressed.current.up)
				socket.send(JSON.stringify({ type: "move", playerId, direction: "up" }))
			if (keysPressed.current.down)
				socket.send(JSON.stringify({ type: "move", playerId, direction: "down" }))
		}

		const gameLoop = () => {
			draw()
			handleInput()
			requestAnimationFrame(gameLoop)
		}

		const animId = requestAnimationFrame(gameLoop)

		const keydown = (e: KeyboardEvent) => {
			if (!playerId || !socketRef.current) return
			const socket = socketRef.current

			if (e.key === "ArrowUp" || e.key === "w")	socket.send(JSON.stringify({ type: "move", playerId, direction: "up" }))
			if (e.key === "ArrowDown" || e.key === "s")	socket.send(JSON.stringify({ type: "move", playerId, direction: "down" }))
		}
		const keyup = (e: KeyboardEvent) => {
			if (!playerId || !socketRef.current) return
			const socket = socketRef.current

			if (e.key === "ArrowUp" || e.key === "w")	socket.send(JSON.stringify({ type: "move", playerId, direction: "notup" }))
			if (e.key === "ArrowDown" || e.key === "s")	socket.send(JSON.stringify({ type: "move", playerId, direction: "notdown" }))
		}

		window.addEventListener("keydown", keydown)
		window.addEventListener("keyup", keyup)

		return () => {
			cancelAnimationFrame(animId)
			window.removeEventListener("keydown", keydown)
			window.removeEventListener("keyup", keyup)
		}
	}, [gameStarted, gameState])

	return (
		<div className="min-h-screen bg-background flex flex-col">
			<MainNav />

			<div className="flex-1 container py-8">
				<div className="mb-8">
					<h1 className="font-pixel text-2xl md:text-3xl mb-2">PONG</h1>
					<p className="font-pixel text-xs text-muted-foreground">THE CLASSIC TABLE TENNIS GAME</p>
				</div>

				<div className="grid gap-8">
					<div className="space-y-4">
						<Card className="overflow-hidden">
							<CardContent className="p-0">
								<canvas
									ref={canvasRef}
									width={800}
									height={600}
									className="w-full h-auto bg-game-dark pixel-border"
								/>
							</CardContent>
							<CardFooter className="flex justify-between p-4">
								<div className="font-pixel text-sm">
									<span className="text-game-blue">{gameState?.left_team.score ?? 0}</span>
									{" - "}
									<span className="text-game-orange">{gameState?.right_team.score ?? 0}</span>
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
				</div>
			</div>
		</div>
	)
}
