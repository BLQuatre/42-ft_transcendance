"use client"

import { useEffect, useRef, useState } from "react"
import { MainNav } from "@/components/Navbar"
import { Card, CardContent } from "@/components/ui/Card"

export default function DinoGamePage() {
	const	canvasRef = useRef<HTMLCanvasElement>(null)
	const	[playerId, setPlayerId] = useState<number | null>(null)
	const	[gameState, setGameState] = useState<any>(null)
	const	[frame, setFrame] = useState(36)
	const	keysRef = useRef({ up: false, down: false })

	const socketRef = useRef<WebSocket | null>(null)

	// Constants
	const FRAME_VAL = 36  // Keeping original value for slower animation

	const TYPE_CACTUS = 1
	const TYPE_SMALL = 2
	const TYPE_GROUP = 3
	const TYPE_PTERO = 4


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

	// WebSocket setup
	useEffect(() => {
		const socket = new WebSocket("ws://localhost:3003")
		socketRef.current = socket

		socket.addEventListener("open", () => {
			console.log("Connected to server")
		})

		socket.addEventListener("message", (event) => {
			const msg = JSON.parse(event.data)
			if (msg.type === "assign") setPlayerId(msg.playerId)
			if (msg.type === "state") setGameState(msg.gameState)
		})

		return () => socket.close()
	}, [])

	// Input handling
	useEffect(() => {
		if (!playerId) return

		const down = (e: KeyboardEvent) => {
			if (e.key === " " || e.key === "ArrowUp") {
				keysRef.current.up = true;
			}
			if (e.key === "ArrowDown") {
				keysRef.current.down = true;
			}
		}

		const up = (e: KeyboardEvent) => {
			if (e.key === " " || e.key === "ArrowUp") {
				keysRef.current.up = false;
			}
			if (e.key === "ArrowDown") {
				keysRef.current.down = false;
			}
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

		requestAnimationFrame(draw)
	}, [gameState, imagesLoaded])

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
