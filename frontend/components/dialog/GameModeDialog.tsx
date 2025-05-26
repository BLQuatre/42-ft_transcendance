"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trophy, User, Users, Monitor } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogClose,
	DialogFooter,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { MultiplayerOptionsDialog } from "./MultiplayerOptionsDialog";
import { GameType } from "@/types/game";
import { useDictionary } from "@/hooks/UseDictionnary";
import { getBorderColor, getBgColor, getTextColor } from "@/lib/colors";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/UseToast";
import { ToastVariant } from "@/types/types";


type GameModeDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	gameType: GameType;
};

enum GameMode {
	MULTIPLAYER = "multiplayer",
	LOCAL = "local",
	TOURNAMENT = "tournament",
	SOLO = "solo",
	AGAINST_AI = "ai",
}

export function GameModeDialog({
	open,
	onOpenChange,
	gameType,
}: GameModeDialogProps) {
	const { accessToken } = useAuth();
	const { toast } = useToast();

	const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
	const [isMultiplayerDialogOpen, setIsMultiplayerDialogOpen] = useState(false);

	function handleModeSelect(mode: GameMode) {
		setSelectedMode(mode);

		if (mode === GameMode.MULTIPLAYER) {
			setIsMultiplayerDialogOpen(true);
		} else if (gameType === "dino" && mode === GameMode.SOLO) {
			const newRoomCode = Math.random()
			.toString(36)
			.substring(2, 8)
			.toUpperCase();
			window.location.assign(`/games/${gameType}/${mode}/${newRoomCode}`);
			onOpenChange(false);
		} else {
			window.location.assign(`/games/${gameType}/${mode}`);
			onOpenChange(false);
		}
	}

	const dict = useDictionary();
	if (!dict) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className={`p-6 ${gameType === "pong" ? "sm:max-w-[1000px]" : "sm:max-w-[600px]"}`}
			>
				<DialogHeader className="animate-fadeIn mb-4">
					<DialogTitle className="font-pixel text-sm uppercase">
						{dict.common.play} {dict.games[gameType].title}
					</DialogTitle>
					<DialogDescription className="font-pixel text-xs">
						{dict.dialogs.gameMode.selectMode}
					</DialogDescription>
				</DialogHeader>

				<div
					className={cn(
						"grid grid-cols-1 gap-4 animate-slideUp",
						gameType === GameType.PONG ? "md:grid-cols-4" : "md:grid-cols-2"
					)}
				>
					{/* Against AI Mode Card */}
					{gameType === GameType.PONG && (
						<div
							className={cn(
								"rounded-md border-2 p-4 cursor-pointer transition-all",
								selectedMode === GameMode.AGAINST_AI
									? [
											getBorderColor(gameType),
											getBgColor(gameType),
											"text-white",
										]
									: "border-muted bg-muted/50 hover:bg-muted"
							)}
							onClick={() => setSelectedMode(GameMode.AGAINST_AI)}
						>
							<div className="flex flex-col items-center text-center space-y-4">
								<div
									className={cn(
										"w-16 h-16 rounded-full flex items-center justify-center",
										selectedMode === GameMode.AGAINST_AI
											? "bg-white/20"
											: getBgColor(gameType)
									)}
								>
									<User className="h-8 w-8 text-white" />
								</div>
								<div>
									<h3
										className={cn(
											"font-pixel text-sm mb-2 uppercase",
											selectedMode === GameMode.AGAINST_AI
												? "text-white"
												: getTextColor(gameType)
										)}
									>
										{dict.dialogs.gameMode.modes.ai.title}
									</h3>
									<p
										className={cn(
											"font-pixel text-xs uppercase",
											selectedMode === GameMode.AGAINST_AI
												? "text-white/80"
												: "text-muted-foreground"
										)}
									>
										{dict.dialogs.gameMode.modes.ai.description}
									</p>
								</div>
							</div>
						</div>
					)}

					{/* Solo Mode Card */}
					{gameType === GameType.DINO && (
						<div
							className={cn(
								"rounded-md border-2 p-4 cursor-pointer transition-all",
								selectedMode === GameMode.SOLO
									? [
											getBorderColor(gameType),
											getBgColor(gameType),
											"text-white",
										]
									: "border-muted bg-muted/50 hover:bg-muted"
							)}
							onClick={() => setSelectedMode(GameMode.SOLO)}
						>
							<div className="flex flex-col items-center text-center space-y-4">
								<div
									className={cn(
										"w-16 h-16 rounded-full flex items-center justify-center",
										selectedMode === GameMode.SOLO
											? "bg-white/20"
											: getBgColor(gameType)
									)}
								>
									<User className="h-8 w-8 text-white" />
								</div>
								<div>
									<h3
										className={cn(
											"font-pixel text-sm mb-2 uppercase",
											selectedMode === GameMode.SOLO
												? "text-white"
												: getTextColor(gameType)
										)}
									>
										{dict.dialogs.gameMode.modes.solo.title}
									</h3>
									<p
										className={cn(
											"font-pixel text-xs uppercase",
											selectedMode === GameMode.SOLO
												? "text-white/80"
												: "text-muted-foreground"
										)}
									>
										{dict.dialogs.gameMode.modes.solo.description}
									</p>
								</div>
							</div>
						</div>
					)}

					{/* 1v1 Local Mode Card - Only show for Pong */}
					{gameType === GameType.PONG && (
						<div
							className={cn(
								"rounded-md border-2 p-4 cursor-pointer transition-all",
								selectedMode === GameMode.LOCAL
									? [
											getBorderColor(gameType),
											getBgColor(gameType),
											"text-white",
										]
									: "border-muted bg-muted/50 hover:bg-muted"
							)}
							onClick={() => setSelectedMode(GameMode.LOCAL)}
						>
							<div className="flex flex-col items-center text-center space-y-4">
								<div
									className={cn(
										"w-16 h-16 rounded-full flex items-center justify-center",
										selectedMode === GameMode.LOCAL
											? "bg-white/20"
											: getBgColor(gameType)
									)}
								>
									<Monitor className="h-8 w-8 text-white" />
								</div>
								<div>
									<h3
										className={cn(
											"font-pixel text-sm mb-2",
											selectedMode === GameMode.LOCAL
												? "text-white"
												: getTextColor(gameType)
										)}
									>
										{dict.dialogs.gameMode.modes.local.title}
									</h3>
									<p
										className={cn(
											"font-pixel text-xs",
											selectedMode === GameMode.LOCAL
												? "text-white/80"
												: "text-muted-foreground"
										)}
									>
										{dict.dialogs.gameMode.modes.local.description}
									</p>
								</div>
							</div>
						</div>
					)}

					{/* Multiplayer Mode Card */}
					<div
						className={cn(
							"rounded-md border-2 p-4 transition-all",
							accessToken === null
								? "cursor-not-allowed opacity-50"
								: "cursor-pointer",
							selectedMode === GameMode.MULTIPLAYER && !(accessToken === null)
								? [getBorderColor(gameType), getBgColor(gameType), "text-white"]
								: "border-muted bg-muted/50 hover:bg-muted"
						)}
						onClick={() => {
							if (accessToken === null) {
								toast({
									title: dict.dialogs.gameMode.loginRequired.title,
									description: dict.dialogs.gameMode.loginRequired.description,
									variant: ToastVariant.WARNING,
									duration: 3000,
								});
							} else {
								setSelectedMode(GameMode.MULTIPLAYER);
							}
						}}
					>
						<div className="flex flex-col items-center text-center space-y-4">
							<div
								className={cn(
									"w-16 h-16 rounded-full flex items-center justify-center",
									selectedMode === GameMode.MULTIPLAYER &&
										!(accessToken === null)
										? "bg-white/20"
										: getBgColor(gameType)
								)}
							>
								<Users className="h-8 w-8 text-white" />
							</div>
							<div>
								<h3
									className={cn(
										"font-pixel text-sm mb-2",
										selectedMode === GameMode.MULTIPLAYER &&
											!(accessToken === null)
											? "text-white"
											: getTextColor(gameType)
									)}
								>
									{dict.dialogs.gameMode.modes.multiplayer.title}
								</h3>
								<p
									className={cn(
										"font-pixel text-xs",
										selectedMode === GameMode.MULTIPLAYER &&
											!(accessToken === null)
											? "text-white/80"
											: "text-muted-foreground"
									)}
								>
									{dict.dialogs.gameMode.modes.multiplayer.description}
								</p>
							</div>
						</div>
					</div>

					{/* Tournament Mode Card - Only show for Pong */}
					{gameType === GameType.PONG && (
						<div
							className={cn(
								"rounded-md border-2 p-4 cursor-pointer transition-all",
								selectedMode === GameMode.TOURNAMENT
									? [
											getBorderColor(gameType),
											getBgColor(gameType),
											"text-white",
										]
									: "border-muted bg-muted/50 hover:bg-muted"
							)}
							onClick={() => setSelectedMode(GameMode.TOURNAMENT)}
						>
							<div className="flex flex-col items-center text-center space-y-4">
								<div
									className={cn(
										"w-16 h-16 rounded-full flex items-center justify-center",
										selectedMode === GameMode.TOURNAMENT
											? "bg-white/20"
											: getBgColor(gameType)
									)}
								>
									<Trophy className="h-8 w-8 text-white" />
								</div>
								<div>
									<h3
										className={cn(
											"font-pixel text-sm mb-2",
											selectedMode === GameMode.TOURNAMENT
												? "text-white"
												: getTextColor(gameType)
										)}
									>
										{dict.dialogs.gameMode.modes.tournament.title}
									</h3>
									<p
										className={cn(
											"font-pixel text-xs",
											selectedMode === GameMode.TOURNAMENT
												? "text-white/80"
												: "text-muted-foreground"
										)}
									>
										{dict.dialogs.gameMode.modes.tournament.description}
									</p>
								</div>
							</div>
						</div>
					)}
				</div>

				<DialogFooter className="pt-6 animate-slideUp">
					<DialogClose asChild>
						<Button
							variant="cancel"
							className="font-pixel text-xs mr-2 uppercase"
						>
							{dict.common.cancel}
						</Button>
					</DialogClose>
					<Button
						variant="custom"
						className={cn("font-pixel text-xs uppercase", getBgColor(gameType))}
						disabled={!selectedMode}
						onClick={() => selectedMode && handleModeSelect(selectedMode)}
					>
						{selectedMode
							? `${dict.common.play} ${dict.dialogs.gameMode.modes[selectedMode].title}`
							: dict.dialogs.gameMode.selectPrompt}
					</Button>
				</DialogFooter>
				{/* Multiplayer Options Dialog */}
				<MultiplayerOptionsDialog
					open={isMultiplayerDialogOpen}
					onOpenChange={setIsMultiplayerDialogOpen}
					gameType={gameType}
				/>
			</DialogContent>
		</Dialog>
	);
}
