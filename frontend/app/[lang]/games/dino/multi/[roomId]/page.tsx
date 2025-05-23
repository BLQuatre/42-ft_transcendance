"use client"

import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/Navbar"
import { Card, CardContent } from "@/components/ui/Card"
import GameRoom, { GameRoom as GameRoomType, Player } from "@/components/WaitingRoom"


export default function DinoGamePage() {
	const params = useParams()
	const roomId = params.roomId as string

	const canvasRef = useRef<HTMLCanvasElement>(null)
	const [gameState, setGameState] = useState<any>(null)

	const [gameFinished, setGameFinished] = useState<boolean>(false)
	const gameFinishedRef = useRef(gameFinished)
	useEffect(() => {
		gameFinishedRef.current = gameFinished
	}, [gameFinished])

	const socketRef = useRef<WebSocket | null>(null)
	const router = useRouter()

	const [playerId, setPlayerId] = useState<number | null>(null)
	const playerIdRef = useRef<number | null>(null);
	useEffect(() => {
		playerIdRef.current = playerId;
	}, [playerId]);

	const keysRef = useRef({ up: false, down: false })

	// Waiting room state
	const [isLoading, setIsLoading] = useState(true)
	const [room, setRoom] = useState<GameRoomType | null>(null)
	const [gameInProgress, setGameInProgress] = useState(false)

	const FRAME_VAL = 36
	const [frame, setFrame] = useState(36)

	const TYPE_CACTUS = 1 ; const TYPE_SMALL = 2 ; const TYPE_GROUP = 3 ; const TYPE_PTERO = 4 ;


	// Load all images once
	const images = useRef<any>({}) ;
	const [imagesLoaded, setImagesLoaded] = useState(false) ;
	useEffect(() => {
		const imageSources = {
			dinoStanding:	"/img/dino_standing.png",
			dinoRun1:		"/img/dino_running1.png",
			dinoRun2:		"/img/dino_running2.png",
			dinoLean1:		"/img/dino_leaning1.png",
			dinoLean2:		"/img/dino_leaning2.png",
			cactus:			"/img/cactus.png",
			small:			"/img/cactus_small.png",
			group:			"/img/cactus_group.png",
			ptero1:			"/img/ptero1.png",
			ptero2:			"/img/ptero2.png",
		} ;

		let loadedCount = 0;
		const total = Object.keys(imageSources).length;

		for (const [key, src] of Object.entries(imageSources)) {
			const img = new Image();
			img.src = `${window.location.origin}${src}`;
			img.onload = () => {
				loadedCount++;
				if (loadedCount === total) {
					setImagesLoaded(true);
				}
			} ;
			img.onerror = (e) => {
				console.error(`Image failed to load: ${img.src}`, e);
			} ;
			images.current[key] = img ;
		}
	}, [])

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

		const socket = new WebSocket("ws://localhost:3011");
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
				if (msg.type === "assign")
					setPlayerId(msg.playerId);
				else if (msg.type === "state")
					setGameState(msg.gameState);
				else if (msg.type === "room_update") {
					if (!msg.room) {
						console.error("Received room_update with no room data");
						return;
					}

					// Transform backend room state to match frontend format
					const transformedRoom: GameRoomType = {
						id: msg.room.id,
						name: `DINO Room #${msg.room.id.slice(-6)}`,
						gameType: "dino",
						maxPlayers: 8,
						status: msg.room.status,
						players: msg.room.players.map((p: any) => ({
							id: p.id.toString(),
							name: p.name || `Player ${p.id}`,
							avatar: null,
							isReady: p.isReady,
							isYou: p.id === playerIdRef.current
						})) as Player[]
					};
					setRoom(transformedRoom);
					setIsLoading(false);
				} else if (msg.type === "game_start") {
					console.log("Game starting!");
					setGameInProgress(true);
				} else if (msg.type === "game_end")
					setGameFinished(true);
			} catch (error) {
				console.error("Error processing WebSocket message:", error);
			}
		});

		socket.addEventListener("close", (event) => {
			console.log("WebSocket connection closed:", event.code, event.reason);
			socketRef.current = null;
			setIsLoading(false);
			setRoom(null);

			setTimeout(() => {
				router.push('/');
			}, 3000);
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

	// Input handling
	useEffect(() => {
		if (!playerId) return

		const down = (e: KeyboardEvent) => {
			if (e.key === " " || e.key === "ArrowUp")	{ keysRef.current.up = true; }
			if (e.key === "ArrowDown")					{ keysRef.current.down = true; }
		}

		const up = (e: KeyboardEvent) => {
			if (e.key === " " || e.key === "ArrowUp")	{ keysRef.current.up = false; }
			if (e.key === "ArrowDown")					{ keysRef.current.down = false; }
		}

		window.addEventListener("keydown", down)
		window.addEventListener("keyup", up)

		return () => {
			window.removeEventListener("keydown", down)
			window.removeEventListener("keyup", up)
		}
	}, [playerId])

	// Continuous input sending
	useEffect(() => {
		if (!playerId || !socketRef.current) return;

		const sendInputs = () => {
			if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;

			// Send jump command if up key is pressed
			if (keysRef.current.up) {
				socketRef.current.send(JSON.stringify({ type: "jump", playerId }));
			}

			// Send down command if down key is pressed
			if (keysRef.current.down) {
				socketRef.current.send(JSON.stringify({ type: "down", playerId }));
			} else {
				// Send up command if down key is not pressed
				socketRef.current.send(JSON.stringify({ type: "up", playerId }));
			}
		};

		// Set up interval to continuously send input state
		const inputInterval = setInterval(sendInputs, 1000 / 60);

		return () => {
			clearInterval(inputInterval);
		};
	}, [playerId]);

	// Rendering
	useEffect(() => {
		if (!canvasRef.current || !gameState || !imagesLoaded) return
		const canvas = canvasRef.current
		const ctx = canvas.getContext("2d")
		if (!ctx) return

		const img = images.current

		const draw = () => {
			// Clear only the score area at the top
			ctx.clearRect(0, 0, canvas.width, 50);

			const offset = canvas.height / (gameState.dinos.length + 1)
			let i = 0

			gameState.dinos.forEach((dino: any) => {
				i++

				if (dino.score > -1) {
					ctx.font = "16px Arial"
					ctx.fillStyle = "#555"
					ctx.fillText(`${dino.score}`, canvas.width - 100, offset * i - offset / 2)
					return
				}

				// Only clear the area for active players
				ctx.clearRect(0, (offset * (i - 1)), canvas.width, offset);

				ctx.fillStyle = "#555"
				ctx.fillRect(20, offset * i - 6, canvas.width - 40, 2)

				// Draw dino
				if (dino.lean) {
					const leanImg = (Math.floor(frame / 12) % 2) === 0 ? img.dinoLean1 : img.dinoLean2
					if (leanImg.complete) {
						ctx.drawImage(leanImg, 40, offset * i - 48 - dino.y, 64, 48)
					}
				} else {
					const runImg = dino.y > 0 ? img.dinoStanding : ((Math.floor(frame / 12) % 2) === 0 ? img.dinoRun1 : img.dinoRun2)
					if (runImg.complete) {
						ctx.drawImage(runImg, 40, offset * i - 48 - dino.y, 48, 48)
					}
				}

				// Draw obstacles
				gameState.obstacles.forEach((ob: any) => {
					const y = offset * i - ob.y
					if (ob.type === TYPE_CACTUS && img.cactus.complete)
						ctx.drawImage(img.cactus, ob.x, y, 32, 48)
					else if (ob.type === TYPE_SMALL && img.small.complete)
						ctx.drawImage(img.small, ob.x, y, 16, 32)
					else if (ob.type === TYPE_GROUP && img.group.complete)
						ctx.drawImage(img.group, ob.x, y, 48, 48)
					else if (ob.type === TYPE_PTERO) {
						const pteroImg = (Math.floor(frame / 12) % 2) === 0 ? img.ptero1 : img.ptero2
						if (pteroImg.complete)
							ctx.drawImage(pteroImg, ob.x, y, 48, 48)
					}
				})
			})

			// Score
			ctx.font = '20px "Press Start 2P"'
			ctx.fillStyle = "#FFF"
			ctx.fillText(`SCORE: ${gameState.score}`, 20, 30)

			setFrame(f => (f - 1 + FRAME_VAL) % FRAME_VAL)

			requestAnimationFrame(draw)
		}
		const animId = requestAnimationFrame(draw)

		return () => {
			cancelAnimationFrame(animId)
		}
	}, [gameState, imagesLoaded])


	// Toggle ready status
	const handleToggleReady = () => {
		if (!socketRef.current || playerIdRef.current === null) return

		socketRef.current.send(JSON.stringify({ type: "toggle_ready" }))
	}

	// If we're still in the waiting room phase
	if (!gameInProgress) {
		return (
			<div className="min-h-screen bg-background">
				<MainNav />
				<GameRoom
					room={room}
					isLoading={isLoading}
					onToggleReady={handleToggleReady}
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
								<canvas ref={canvasRef} width={800} height={500} className="w-full h-auto bg-game-dark pixel-border" />
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	)
}
