"use client";

import { useState } from "react";
import Image from "next/image";
import { Users, CheckCircle, XCircle, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import BackToHomeButton from "@/components/BackToHome";
import { useDictionary } from "@/hooks/UseDictionnary"; // Add dictionary hook

// Types
export type Player = {
	id: string;
	name: string;
	avatar: string | null;
	isReady: boolean;
	isYou: boolean;
};

export type GameRoom = {
	id: string;
	name: string;
	gameType: string;
	maxPlayers: number;
	status: "waiting" | "starting" | "in-progress" | "finished";
	players: Player[];
};

interface GameRoomProps {
	room: GameRoom | null;
	isLoading: boolean;
	onToggleReady: () => void;
}

export default function GameRoom({
	room,
	isLoading,
	onToggleReady,
}: GameRoomProps) {
	const [copied, setCopied] = useState(false);
	const isPong = room?.gameType === "pong";
	const dict = useDictionary(); // Add dictionary hook

	// Copy room code to clipboard
	const copyRoomCode = () => {
		if (room) {
			navigator.clipboard.writeText(room.id);
			setCopied(true);

			// Reset copied state after 2 seconds
			setTimeout(() => {
				setCopied(false);
			}, 2000);
		}
	};

	if (!dict) return null; // Add early return if dictionary isn't loaded

	if (isLoading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="font-pixel text-lg animate-pulse">
					{dict.games.dino.multi.connection.connected}
				</div>
			</div>
		);
	}

	if (!room) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="font-pixel text-lg animate-pulse">
					{dict.games.dino.multi.errors.noRoomData}
				</div>
			</div>
		);
	}

	// If no players yet, show connecting state
	if (room.players.length === 0) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="font-pixel text-lg animate-pulse">
					{dict.games.dino.multi.connection.creating}
				</div>
			</div>
		);
	}

	// Check if all players are ready - for showing appropriate status
	const allPlayersReady =
		room.players.length > 1 && room.players.every((player) => player.isReady);
	const currentPlayer = room.players.find((player) => player.isYou);

	return (
		<div className="min-h-screen bg-background">
			<div className="container px-4 py-6 mx-auto max-w-5xl">
				{/* Back Button - with more space below */}
				<div className="mb-8">
					<BackToHomeButton gameType={room.gameType} />
				</div>

				{/* Room Header */}
				<div className="mb-6">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
						<div>
							<h1
								className={cn(
									"font-pixel text-xl md:text-2xl uppercase mb-1",
									isPong ? "text-blue-500" : "text-orange-500"
								)}
							>
								{room.name}
							</h1>
							<div className="flex items-center gap-2">
								<Badge variant="outline" className="font-pixel text-xs">
									{room.gameType.toUpperCase()}
								</Badge>
								<Badge
									variant="outline"
									className={cn(
										"font-pixel text-xs",
										room.status === "waiting"
											? "bg-yellow-500/10 text-yellow-500"
											: room.status === "starting"
												? "bg-blue-500/10 text-blue-500"
												: "bg-green-500/10 text-green-500"
									)}
								>
									{room.status === "waiting"
										? dict.games.dino.multi.waitingRoom.title
										: room.status === "starting"
											? dict.games.dino.multi.connection.gameStarting
											: dict.common.play}
								</Badge>
								{allPlayersReady && room.status === "waiting" && (
									<Badge
										variant="outline"
										className="bg-blue-500/10 text-blue-500 font-pixel text-xs"
									>
										{dict.games.dino.multi.waitingRoom.waitingForReady}
									</Badge>
								)}
							</div>
						</div>

						{room.status === "waiting" && (
							<Button
								className={cn(
									"font-pixel text-sm uppercase w-full md:w-auto",
									currentPlayer?.isReady
										? "bg-red-500 hover:bg-red-600"
										: isPong
											? "bg-blue-500 hover:bg-blue-600"
											: "bg-orange-500 hover:bg-orange-600"
								)}
								onClick={onToggleReady}
							>
								{currentPlayer?.isReady ? (
									<>
										<XCircle className="mr-2 h-4 w-4" />
										{dict.games.dino.multi.waitingRoom.notReady}
									</>
								) : (
									<>
										<CheckCircle className="mr-2 h-4 w-4" />
										{dict.games.dino.multi.waitingRoom.ready}
									</>
								)}
							</Button>
						)}
					</div>
				</div>

				{/* Room Code Section */}
				<div
					className={cn(
						"p-4 rounded-md mb-6 flex items-center justify-between",
						isPong ? "bg-blue-500/10" : "bg-orange-500/10"
					)}
				>
					<div>
						<div className="font-pixel text-xs text-muted-foreground mb-1">
							{dict.games.dino.multi.roomCode}
						</div>
						<div className="font-pixel text-lg tracking-wider">
							{room.id.toUpperCase()}
						</div>
					</div>
					<Button
						variant="outline"
						size="sm"
						className={cn(
							"font-pixel text-xs border-2 transition-all",
							copied
								? "bg-green-500 text-white border-green-500"
								: isPong
									? "border-blue-500 hover:bg-blue-500 hover:text-white"
									: "border-orange-500 hover:bg-orange-500 hover:text-white"
						)}
						onClick={copyRoomCode}
					>
						{copied ? (
							<>
								<Check className="h-4 w-4 mr-1" />
								{dict.games.dino.multi.copied}
							</>
						) : (
							<>
								<Copy className="h-4 w-4 mr-1" />
								{dict.games.dino.multi.copyCode}
							</>
						)}
					</Button>
				</div>

				{/* Players Section - No box/border */}
				<div>
					{/* Players Header */}
					<div
						className={cn(
							"px-4 py-2 flex justify-between items-center rounded-t-md mb-3",
							isPong ? "bg-blue-500/10" : "bg-orange-500/10"
						)}
					>
						<div className="flex items-center">
							<Users className="h-4 w-4 mr-2" />
							<h3 className="font-pixel text-sm uppercase">
								{dict.dashboard.sections.history.players}
							</h3>
						</div>
						<span className="font-pixel text-xs text-muted-foreground">
							{room.players.length}/{room.maxPlayers}
						</span>
					</div>

					{/* Players Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
						{/* Render actual players */}
						{room.players.map((player) => (
							<div
								key={player.id}
								className={cn(
									"flex items-center justify-between p-3 rounded-md",
									player.isYou
										? isPong
											? "bg-blue-500/10"
											: "bg-orange-500/10"
										: "bg-muted/30"
								)}
							>
								<div className="flex items-center">
									{player.avatar ? (
										<div className="w-10 h-10 rounded-full overflow-hidden mr-3">
											<Image
												src={player.avatar || "/placeholder.svg"}
												alt={player.name}
												width={40}
												height={40}
												className="object-cover"
											/>
										</div>
									) : (
										<div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mr-3">
											<span className="font-pixel text-lg text-muted-foreground">
												{player.name.charAt(0)}
											</span>
										</div>
									)}
									<div>
										<div className="flex items-center">
											<span className="font-pixel text-sm">
												{player.name}
												{player.isYou &&
													` (${dict.games.dino.multi.waitingRoom.you})`}
											</span>
										</div>
									</div>
								</div>

								<div className="flex items-center">
									{player.isReady ? (
										<Badge className="font-pixel text-xs bg-green-500">
											<CheckCircle className="mr-1 h-3 w-3" />
											{dict.games.dino.multi.waitingRoom.ready}
										</Badge>
									) : (
										<Badge
											variant="outline"
											className="font-pixel text-xs text-muted-foreground"
										>
											<XCircle className="mr-1 h-3 w-3" />
											{dict.games.dino.multi.waitingRoom.notReady}
										</Badge>
									)}
								</div>
							</div>
						))}

						{/* Render empty slots */}
						{Array.from(
							{ length: room.maxPlayers - room.players.length },
							(_, index) => (
								<div
									key={`empty-slot-${index}`}
									className="flex items-center justify-between p-3 rounded-md border border-dashed border-muted bg-muted/10"
								>
									<div className="flex items-center">
										<div className="w-10 h-10 rounded-full bg-muted/30 flex items-center justify-center mr-3">
											<Users className="h-5 w-5 text-muted-foreground/50" />
										</div>
										<div>
											<div className="flex items-center">
												<span className="font-pixel text-sm text-muted-foreground/70">
													{dict.games.dino.multi.waitingRoom.waitingForPlayers}
												</span>
											</div>
											<span className="font-pixel text-xs text-muted-foreground/50">
												{dict.games.dino.multi.waitingRoom.emptySlot}
											</span>
										</div>
									</div>

									<div className="flex items-center">
										<Badge
											variant="outline"
											className="font-pixel text-xs text-muted-foreground/50 border-dashed"
										>
											{dict.games.dino.multi.waitingRoom.open}
										</Badge>
									</div>
								</div>
							)
						)}
					</div>

					{room.status === "waiting" && (
						<div className="text-center">
							<p className="font-pixel text-xs text-muted-foreground">
								{dict.games.dino.multi.waitingRoom.autoStart}
							</p>
							{isPong && (
								<p className="font-pixel text-xs text-muted-foreground">
									{dict.games.pong.players}
								</p>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
