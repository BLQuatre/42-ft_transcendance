"use client"

import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { MainNav } from "@/components/Navbar"
import { Card, CardContent } from "@/components/ui/Card"
import { PongState } from "@/types/types" // Ensure this matches your backend types
import GameRoom, { GameRoom as GameRoomType, Player } from "@/components/WaitingRoom" // Import your GameRoom component

export default function PongGamePage() {
	const params = useParams()
	const roomId = params.roomId as string
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const [gameState, setGameState] = useState<PongState | null>(null)
	const socketRef = useRef<WebSocket | null>(null)

	const [playerId, setPlayerId] = useState<number | null>(null)
	const playerIdRef = useRef<number | null>(null);
	useEffect(() => {
		playerIdRef.current = playerId;
	}, [playerId]);
	
	// Waiting room state
	const [isLoading, setIsLoading] = useState(true)
	const [room, setRoom] = useState<GameRoomType | null>(null)
	const [gameInProgress, setGameInProgress] = useState(false)


	
	// Initialize the socket connection
	useEffect(() => {
		if (!roomId) {
			console.error("roomId is undefined or invalid during WebSocket initialization");
			return;
		}
	
		// Prevent creating multiple connections
		if (socketRef.current && socketRef.current.readyState !== WebSocket.CLOSED) {
			console.log("WebSocket connection already exists and is open");
			return;
		}
	
		console.log("Creating new WebSocket connection");
		
		// Your server is set up to accept connections on ws://localhost:3002 without a path
		const socket = new WebSocket("ws://localhost:3002");
		socketRef.current = socket;
	
		socket.addEventListener("open", () => {
			console.log("Connected to game server");
			
			// After connection, immediately send join_room message with roomId
			socket.send(JSON.stringify({ 
				type: "join_room", 
				roomId: roomId 
			}));
		});
	
		socket.addEventListener("message", (event) => {
			try {
				const msg = JSON.parse(event.data);
				console.log("Received WebSocket message:", msg.type);
				
				// Handle different message types
				if (msg.type === "assign") {
					console.log("Assigned player ID:", msg.playerId);
					setPlayerId(msg.playerId);
				}
				else if (msg.type === "state") {
					setGameState(msg.gameState);
				}
				// Handle room state updates
				else if (msg.type === "room_update") {
					console.log("Room update received:", msg.room);
					if (!msg.room) {
						console.error("Received room_update with no room data");
						return;
					}
					
					// Transform backend room state to match frontend format
					const transformedRoom: GameRoomType = {
						id: msg.room.id,
						name: `PONG Room #${msg.room.id.slice(-6)}`,
						gameType: "pong",
						maxPlayers: 8,
						status: msg.room.status,
						players: msg.room.players.map((p: any) => ({
							id: p.id.toString(),
							name: p.name || `Player ${p.id}`,
							avatar: null,
							isReady: p.isReady,
							isYou: p.id === playerIdRef.current // Use current playerId value
						})) as Player[]
					};
					setRoom(transformedRoom);
					setIsLoading(false);
				}
				// Handle game start
				else if (msg.type === "game_start") {
					console.log("Game starting!");
					setGameInProgress(true);
				}
			} catch (error) {
				console.error("Error processing WebSocket message:", error);
			}
		});
	
		socket.addEventListener("close", (event) => {
			console.log("WebSocket connection closed:", event.code, event.reason);
			socketRef.current = null;
		});
	
		socket.addEventListener("error", (error) => {
			console.error("WebSocket error:", JSON.stringify(error));
		});
	
		// Cleanup on unmount
		return () => {
			console.log("Cleaning up WebSocket connection");
			if (socket && socket.readyState !== WebSocket.CLOSED) {
				socket.close();
			}
			socketRef.current = null;
		};
	}, [roomId]);
	
	
	// Handle game rendering
	useEffect(() => {
		if (!canvasRef.current || !gameInProgress) return
	
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
			const offset = 20
		
			ctx.fillStyle = "#4A9DFF"
			gameState.left_team.players.forEach(player =>
				ctx.fillRect(offset, player.top, offset, player.bot - player.top)
			)
			ctx.fillStyle = "#FFA500"
			gameState.right_team.players.forEach(player =>
				ctx.fillRect(canvas.width - (offset * 2), player.top, offset, player.bot - player.top)
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
	
		const gameLoop = () => {
			draw()
			requestAnimationFrame(gameLoop)
		}
		const animId = requestAnimationFrame(gameLoop)
	
		const keydown = (e: KeyboardEvent) => {
			if (!playerId || !socketRef.current) return
			const socket = socketRef.current
		
			if (e.key === "ArrowUp" || e.key === "w") socket.send(JSON.stringify({ type: "move", playerId, direction: "up" }))
			if (e.key === "ArrowDown" || e.key === "s") socket.send(JSON.stringify({ type: "move", playerId, direction: "down" }))
		}
		const keyup = (e: KeyboardEvent) => {
			if (!playerId || !socketRef.current) return
			const socket = socketRef.current
		
			if (e.key === "ArrowUp" || e.key === "w") socket.send(JSON.stringify({ type: "move", playerId, direction: "notup" }))
			if (e.key === "ArrowDown" || e.key === "s") socket.send(JSON.stringify({ type: "move", playerId, direction: "notdown" }))
		}
	
		window.addEventListener("keydown", keydown)
		window.addEventListener("keyup", keyup)
	
		return () => {
			cancelAnimationFrame(animId)
			window.removeEventListener("keydown", keydown)
			window.removeEventListener("keyup", keyup)
		}
	}, [gameState, gameInProgress, playerId])
	
	// Toggle ready status
	const handleToggleReady = () => {
		if (!socketRef.current || playerIdRef.current === null) return
		
		socketRef.current.send(JSON.stringify({ type: "toggle_ready" }))
	}
	
	// If we're still in the waiting room phase
	if (!gameInProgress) {
		// Create default room data if not provided by server yet
		const defaultRoom: GameRoomType = room || {
			id: roomId,
			name: `PONG Room #${roomId.slice(-4)}`,
			gameType: "pong",
			maxPlayers: 4,
			status: "waiting",
			players: []
		}
	
		return (
			<div className="min-h-screen bg-background">
				<MainNav />
				<GameRoom
					room={defaultRoom}
					isLoading={isLoading}
					countdown={null}
					onToggleReady={handleToggleReady}
					onGameStart={() => {}}
					showBackButton={true}
				/>
			</div>
		)
	}
	
	// Game is in progress, show the game view
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