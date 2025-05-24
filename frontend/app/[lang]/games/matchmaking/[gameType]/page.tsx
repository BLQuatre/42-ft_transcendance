"use client"

import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { MainNav } from "@/components/Navbar"
import { useRouter } from "next/navigation"
import { GameType } from "@/types/game"

import { useAuth } from "@/contexts/auth-context"
import api from "@/lib/api"
import { cn } from "@/lib/utils"


export default function PongGamePage() {
	const { accessToken } = useAuth()

	const params = useParams()
	const gameType = params.gameType as GameType

	const eloRef = useRef(0)
	const [widenNotif, setWidenNotif] = useState(false)
	useEffect(() => {
		if (widenNotif === true) {
			setTimeout(() => {
				setWidenNotif(false) ;
			}, 3000)
		}
	}, [widenNotif]) // when widenNotif is set as true, put it back as false after 3 sec

	const socketRef = useRef<WebSocket | null>(null)
	const router = useRouter()

	const playerId = localStorage.getItem('userId')


	useEffect(() => {
		api.get(`/history/stats/${playerId}`).then(response => {
			const userStats = response.data.user
			eloRef.current = (gameType === 'pong') ? userStats.pong_win_rate : userStats.best_dino_score
		})
		.catch(() => eloRef.current = 0)
	}, [])


	// Initialize the socket connection
	useEffect(() => {
		if (!eloRef) return;

		if (!accessToken) {
			console.error("accessToken is undefined or invalid during WebSocket initialization");
			return;
		}

		if (!gameType) {
			console.error("roomId is undefined or invalid during WebSocket initialization");
			return;
		}

		if (!Object.values(GameType).includes(gameType)) {
			router.push('/');
		}

		// Prevent creating multiple connections
		if (socketRef.current && socketRef.current.readyState !== WebSocket.CLOSED) {
			console.log("WebSocket connection already exists and is open");
			return;
		}

		console.log("Creating new WebSocket connection");
		const socket = new WebSocket("wss://localhost/api/ws/matchmaking");
		socketRef.current = socket;

		socket.addEventListener("open", () => {
			console.log("Connected to game server");

			// After connection, immediately send match message with gameType
			socket.send(JSON.stringify({
				type: "match",
				uuid: playerId,
				gameType: gameType,
				elo: eloRef.current
			}));
		});

		socket.addEventListener("message", (event) => {
			try {
				const msg = JSON.parse(event.data);
				console.log("Received WebSocket message:", msg.type);

				// Handle different message types
				if (msg.type === "matched") {
					const newRoomCode = msg.roomId ;
					window.location.assign(`/games/${gameType}/multi/${newRoomCode}`)
				} else if (msg.type === "widening")
					setWidenNotif(true)
			} catch (error) {
				console.error("Error processing WebSocket message:", error);
			}
		});

		socket.addEventListener("close", (event) => {
			console.log("WebSocket connection closed:", event.code, event.reason);
			socketRef.current = null;

			router.push('/');
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
	}, [gameType, accessToken, eloRef.current]);


	return (
		<div className="min-h-screen bg-background flex flex-col overflow-hidden">
			<MainNav />
			<div className="min-h-screen bg-background flex flex-col items-center justify-center">
				<div className="font-pixel text-lg animate-pulse">LOOKING FOR AN OPPONENT</div>
				<div className={cn("font-pixel text-base text-white/50", widenNotif ? "" : "select-none")}>{widenNotif ? "SEARCHING FURTHER" : " "}</div>
			</div>
		</div>
	)
}
