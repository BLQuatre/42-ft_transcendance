"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MainNav } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/Card";
import { useDictionary } from "@/hooks/UseDictionnary";
import BackToHomeButton from "@/components/BackToHome";

import { useAuth } from "@/contexts/auth-context";
import { BaseUser } from "@/types/user";
import api from "@/lib/api";

import GameRoom, {
	GameRoom as GameRoomType,
	Player,
} from "@/components/WaitingRoom";
import DinoLane from "@/app/[lang]/games/dino/components/DinoLane";

export default function DinoGamePage() {
	const dict = useDictionary();
	const { accessToken } = useAuth();

	const params = useParams();
	const roomId = params.roomId as string;

	const userRef = useRef<BaseUser | null>(null);

	const [gameState, setGameState] = useState<any>(null);
	const [frozenLanes, setFrozenLanes] = useState<
		Record<number, { dino: any; obstacles: any[] }>
	>({});

	const [gameFinished, setGameFinished] = useState<boolean>(false);
	const gameFinishedRef = useRef(gameFinished);
	useEffect(() => {
		gameFinishedRef.current = gameFinished;
	}, [gameFinished]);

	const socketRef = useRef<WebSocket | null>(null);
	const router = useRouter();

	const playerId = localStorage.getItem("userId");
	const keysRef = useRef({ up: false, down: false });

	// Waiting room state
	const [isLoading, setIsLoading] = useState(true);
	const [room, setRoom] = useState<GameRoomType | null>(null);
	const [gameInProgress, setGameInProgress] = useState(false);

	const [frame, setFrame] = useState(36);
	useEffect(() => {
		api.get(`/user/${playerId}`).then((response) => {
			userRef.current = response.data.user;
		});

		const intervalId = setInterval(() => {
			setFrame((prev) => (prev + 1) % 2);
		}, 250);

		return () => {
			clearInterval(intervalId);
		};
	}, []);

	// Load all images once
	const images = useRef<any>({});
	useEffect(() => {
		const imageSources = {
			dinoStanding: "/images/dino/dino_standing.png",
			dinoRun1: "/images/dino/dino_running1.png",
			dinoRun2: "/images/dino/dino_running2.png",
			dinoLean1: "/images/dino/dino_leaning1.png",
			dinoLean2: "/images/dino/dino_leaning2.png",
			cactus: "/images/dino/cactus.png",
			small: "/images/dino/cactus_small.png",
			group: "/images/dino/cactus_group.png",
			ptero1: "/images/dino/ptero1.png",
			ptero2: "/images/dino/ptero2.png",
		};

		for (const [key, src] of Object.entries(imageSources)) {
			const img = new Image();
			img.src = `${window.location.origin}${src}`;
			img.onerror = (e) => {
				console.error(`Image failed to load: ${img.src}`, e);
			};
			images.current[key] = img;
		}
	}, []);

	// Initialize the socket connection
	useEffect(() => {
		if (!accessToken) {
			console.error(
				dict?.games.dino.multi.errors.noToken || "Access token is undefined"
			);
			return;
		}

		if (!userRef.current) {
			console.error(
				dict?.games.dino.multi.errors.noUser || "User data not yet defined"
			);
			return;
		}

		if (!roomId) {
			console.error(
				dict?.games.dino.multi.errors.noRoom || "Room ID is undefined"
			);
			return;
		}

		// Prevent creating multiple connections
		if (
			socketRef.current &&
			socketRef.current.readyState !== WebSocket.CLOSED
		) {
			console.log(
				dict?.games.dino.multi.errors.connectionExists ||
					"WebSocket connection already exists"
			);
			return;
		}

		console.log(
			dict?.games.dino.multi.connection.creating ||
				"Creating new WebSocket connection"
		);

		const socket = new WebSocket(`wss://${window.location.host}/api/ws/dino`);
		socketRef.current = socket;

		socket.addEventListener("open", () => {
			console.log(
				dict?.games.dino.multi.connection.connected ||
					"Connected to game server"
			);

			// After connection, immediately send uuid
			socket.send(
				JSON.stringify({
					type: "assign",
					uuid: playerId,
					name: userRef.current?.name || "Player",
				})
			);
			// Then, send join_room message with roomId
			socket.send(
				JSON.stringify({
					type: "join_room",
					roomId: roomId,
				})
			);
		});

		socket.addEventListener("message", (event) => {
			try {
				const msg = JSON.parse(event.data);
				if (msg.type === "state") {
					const newState = msg.gameState;

					setFrozenLanes((currentFrozenLanes) => {
						const updatedFrozenLanes = { ...currentFrozenLanes };

						newState.dinos.forEach((dino: any, index: number) => {
							// Check if dino just died (score >= 0, meaning they got a final score) and lane isn't already frozen
							if (dino.score >= 0 && !(index in currentFrozenLanes)) {
								updatedFrozenLanes[index] = {
									dino: dino,
									obstacles: [...newState.obstacles], // snapshot current obstacles
								};
							}
						});

						return updatedFrozenLanes;
					});

					setGameState(newState);
				} else if (msg.type === "room_update") {
					if (!msg.room) {
						console.error("No room data received");
						return;
					}

					// Transform backend room state to match frontend format
					const transformedRoom: GameRoomType = {
						id: msg.room.id,
						name: `${dict?.games.dino.multi.roomPrefix || "DINO Room"} #${msg.room.id.slice(-6)}`,
						gameType: "dino",
						maxPlayers: 4,
						status: msg.room.status,
						players: msg.room.players.map((p: any) => ({
							id: p.id.toString(),
							name:
								p.name ||
								`${dict?.games.dino.defaultPlayerName || "Player"} ${p.id}`,
							avatar: null,
							isReady: p.isReady,
							isYou: p.id === playerId,
						})) as Player[],
					};
					setRoom(transformedRoom);
					setIsLoading(false);
				} else if (msg.type === "game_start") {
					console.log(
						dict?.games.dino.multi.connection.gameStarting || "Game starting!"
					);
					setGameInProgress(true);
				} else if (msg.type === "game_end") setGameFinished(true);
			} catch (error) {
				console.error("Error processing WebSocket message:", error);
			}
		});

		socket.addEventListener("close", (event) => {
			console.log(
				dict?.games.dino.multi.errors.connectionClosed ||
					"WebSocket connection closed:",
				event.code,
				event.reason
			);
			socketRef.current = null;
			setIsLoading(false);
			setRoom(null);

			setTimeout(() => {
				router.push("/");
			}, 3000);
		});

		socket.addEventListener("error", (error) => {
			console.error("WebSocket error:", JSON.stringify(error));
		});

		// Cleanup on unmount
		return () => {
			console.log(
				dict?.games.dino.multi.connection.cleaning ||
					"Cleaning up WebSocket connection"
			);
			if (socket && socket.readyState !== WebSocket.CLOSED) {
				socket.close();
			}
			socketRef.current = null;
		};
	}, [roomId, accessToken, userRef.current, dict]);

	// Input handling
	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === " " || e.key === "ArrowUp") {
				keysRef.current.up = true;
			}
			if (e.key === "ArrowDown") {
				keysRef.current.down = true;
			}
		};

		const up = (e: KeyboardEvent) => {
			if (e.key === " " || e.key === "ArrowUp") {
				keysRef.current.up = false;
			}
			if (e.key === "ArrowDown") {
				keysRef.current.down = false;
			}
		};

		window.addEventListener("keydown", down);
		window.addEventListener("keyup", up);

		return () => {
			window.removeEventListener("keydown", down);
			window.removeEventListener("keyup", up);
		};
	}, []);

	// Continuous input sending
	useEffect(() => {
		if (!socketRef.current) return;

		const sendInputs = () => {
			if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN)
				return;

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

	// Toggle ready status
	const handleToggleReady = () => {
		if (!socketRef.current) return;

		socketRef.current.send(JSON.stringify({ type: "toggle_ready" }));
	};

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
		);
	}

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
								const laneObstacles = isFrozen
									? frozenLanes[index].obstacles
									: gameState.obstacles;

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
				{gameFinished && (
					<BackToHomeButton
						gameType="dino"
						className="absolute bottom-4 w-[80%]"
					/>
				)}
			</div>
		</div>
	);
}
