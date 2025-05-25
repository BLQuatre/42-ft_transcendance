"use client"

import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/Navbar"
import { Card, CardContent } from "@/components/ui/Card"
import { useDictionary } from "@/hooks/UseDictionnary"
import BackToHomeButton from "@/components/BackToHome"

import { useAuth } from "@/contexts/auth-context"
import { BaseUser } from "@/types/user"
import api from "@/lib/api"

import DinoLane from "@/app/[lang]/games/dino/components/DinoLane"


export default function DinoGamePage() {
	const { accessToken } = useAuth()
	const dict = useDictionary()

	const params = useParams()
	const roomId = params.roomId as string

	const userRef = useRef<BaseUser | null>(null)

	const [gameState, setGameState] = useState<any>(null)
	const [frozenLanes, setFrozenLanes] = useState<Record<number, { dino: any, obstacles: any[] }>>({});

	const [gameFinished, setGameFinished] = useState<boolean>(false)
	const gameFinishedRef = useRef(gameFinished)
	useEffect(() => {
		gameFinishedRef.current = gameFinished
	}, [gameFinished])

	const socketRef = useRef<WebSocket | null>(null)
	const router = useRouter()

	const playerId = localStorage.getItem('userId')
	const keysRef = useRef({ up: false, down: false })

	const [frame, setFrame] = useState(36)
	useEffect(() => {
		api.get(`/user/${playerId}`).then((response => {
			userRef.current = response.data.user
		}))

		const intervalId = setInterval(() => {
			setFrame((prev) => (prev + 1) % 2) ;
		}, 250)

		return () => { clearInterval(intervalId) ; }
	}, []) ;


	// Load all images once
	const images = useRef<any>({}) ;
	useEffect(() => {
		const imageSources = {
			dinoStanding:	"/images/dino/dino_standing.png",
			dinoRun1:		"/images/dino/dino_running1.png",
			dinoRun2:		"/images/dino/dino_running2.png",
			dinoLean1:		"/images/dino/dino_leaning1.png",
			dinoLean2:		"/images/dino/dino_leaning2.png",
			cactus:			"/images/dino/cactus.png",
			small:			"/images/dino/cactus_small.png",
			group:			"/images/dino/cactus_group.png",
			ptero1:			"/images/dino/ptero1.png",
			ptero2:			"/images/dino/ptero2.png",
		} ;

		for (const [key, src] of Object.entries(imageSources)) {
			const img = new Image();
			img.src = `${window.location.origin}${src}`;
			img.onerror = (e) => {
				console.error(`Image failed to load: ${img.src}`, e);
			} ;
			images.current[key] = img ;
		}
	}, [])

	// Initialize the socket connection
	useEffect(() => {
		if (!accessToken) {
			console.error("accessToken is undefined or invalid during WebSocket initialization");
			return;
		}

		if (!userRef.current) {
			console.error("user data not yet defined");
			return;
		}

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

		const socket = new WebSocket("wss://localhost/api/ws/dino");
		socketRef.current = socket;

		socket.addEventListener("open", () => {
			console.log("Connected to game server");

			// After connection, immediately send uuid
			socket.send(JSON.stringify({
				type: "assign",
				uuid: playerId,
				name: userRef.current?.name || 'Player'
			}));
			// Then, send join_room message with roomId
			socket.send(JSON.stringify({
				type: "join_room",
				roomId: roomId
			}));

			socket.send(JSON.stringify({ type: "toggle_ready" }));
		});

		socket.addEventListener("message", (event) => {
			try {
				const msg = JSON.parse(event.data);
				console.log("Received WebSocket message:", msg.type);

				if (msg.type === "state") {
					const newState = msg.gameState;

					setFrozenLanes((currentFrozenLanes) => {
						const updatedFrozenLanes = { ...currentFrozenLanes };

						newState.dinos.forEach((dino: any, index: number) => {
							// Check if dino just died (score >= 0, meaning they got a final score) and lane isn't already frozen
							if (dino.score >= 0 && !(index in currentFrozenLanes)) {
								console.log("Freezing lane", index, "with final score:", dino.score);

								// Freeze the lane with current state just before death
								updatedFrozenLanes[index] = {
									dino: dino,
									obstacles: [...newState.obstacles] // snapshot current obstacles
								};
							}
						});

						return updatedFrozenLanes;
					});

					setGameState(newState);
				} else if (msg.type === "game_start")
					console.log("Game starting!");
				else if (msg.type === "game_end")
					setGameFinished(true);
			} catch (error) {
				console.error("Error processing WebSocket message:", error);
			}
		});

		socket.addEventListener("close", (event) => {
			console.log("WebSocket connection closed:", event.code, event.reason);
			socketRef.current = null;

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
	}, [roomId, accessToken, userRef.current]);

	// Input handling
	useEffect(() => {
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
	}, [])

	// Continuous input sending
	useEffect(() => {
		if (!socketRef.current) return;

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
	}, [socketRef.current]);


	// Game is in progress, show the game view
	return (
		<div className="min-h-screen bg-background flex flex-col overflow-hidden">
			<MainNav />
			<div className="flex-1 flex items-center justify-center px-4 w-[80%] mx-auto">
				<div className="w-full">
					<Card className="overflow-hidden">
						<div className="pl-8 py-2 font-pixel text-2xl">
							{dict?.games.dino.multi.score || "SCORE"}: {gameState?.score || 0}
						</div>

						<CardContent className="p-0">
							{gameState?.dinos.map((dino: any, index: number) => {
								const isFrozen = frozenLanes[index] !== undefined;
								const laneDino = isFrozen ? frozenLanes[index].dino : dino;
								const laneObstacles = isFrozen ? frozenLanes[index].obstacles : gameState.obstacles;

								return (
									<DinoLane
										key={`dino-lane-${index}`}
										dino={laneDino}
										obstacles={laneObstacles}
										images={images.current}
										frame={isFrozen ? -1 : frame}
									/>
								);
							})}
							
						</CardContent>
					</Card>
				</div>
				
				{/* Back to home button at bottom of page */}
				{gameFinished && <BackToHomeButton gameType='dino' className="absolute bottom-4 w-[80%]"/>}
			</div>
		</div>
	)
}
