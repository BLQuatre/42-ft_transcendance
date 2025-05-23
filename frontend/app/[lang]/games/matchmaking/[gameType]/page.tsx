"use client"

import { useParams } from "next/navigation"
import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { GameType } from "@/types/game"


export default function PongGamePage() {
	const { accessToken } = useAuth()

	const params = useParams()
	const gameType = params.gameType as GameType

	const socketRef = useRef<WebSocket | null>(null)
	const router = useRouter()


	// Initialize the socket connection
	useEffect(() => {
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
		const socket = new WebSocket("wss://localhost/tmp_match/");
		socketRef.current = socket;

		socket.addEventListener("open", () => {
			console.log("Connected to game server");

			// After connection, immediately send match message with gameType
			socket.send(JSON.stringify({
				type: "match",
				gameType: gameType
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
				}
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
	}, [gameType, accessToken]);


	return (
		<div className="min-h-screen bg-background flex items-center justify-center">
			<div className="font-pixel text-lg animate-pulse">SEARCHING FOR AN OPPONENT...</div>
		</div>
	)
}
