"use client";

import { Button } from "@/components/ui/Button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogClose,
	DialogFooter,
} from "@/components/ui/Dialog";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useDictionary } from "@/hooks/UseDictionnary";

type Player = {
	id: string;
	user_id: string | null;
	username: string;
	is_bot: boolean;
	avatar?: string;
};

type GameResult = {
	id: string;
	score: number;
	is_winner: boolean;
	player: Player;
};

type GameSession = {
	id: string;
	game_type: "PONG" | "DINO";
	created_at: string;
	results: GameResult[];
};

type MatchDetailsDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	match: {
		type: "pong" | "dino";
		details: GameSession;
	} | null;
};

type EnhancedUserData = {
	id: string;
	username: string;
	avatar: string | null;
};

export function MatchDetailsDialog({
	open,
	onOpenChange,
	match,
}: MatchDetailsDialogProps) {
	const router = useRouter();
	const [playerData, setPlayerData] = useState<
		Record<string, EnhancedUserData>
	>({});
	const [isLoading, setIsLoading] = useState(false);
	const dict = useDictionary();

	useEffect(() => {
		if (!open || !match) return;

		const fetchPlayerDetails = async () => {
			setIsLoading(true);
			const humanPlayers = match.details.results
				.filter((result) => !result.player.is_bot && result.player.user_id)
				.map((result) => result.player.user_id);

			const uniqueUserIds = Array.from(new Set(humanPlayers));
			const newPlayerData: Record<string, EnhancedUserData> = {};

			try {
				await Promise.all(
					uniqueUserIds.map(async (userId) => {
						if (!userId) return;

						try {
							const response = await api.get(`/user/${userId}`);
							const userData = response.data.user;

							newPlayerData[userId] = {
								id: userId,
								username: userData.username || userData.name || "Unknown User",
								avatar: userData.avatar,
							};
						} catch (error) {}
					})
				);
			} catch (error) {
			} finally {
				setPlayerData(newPlayerData);
				setIsLoading(false);
			}
		};

		fetchPlayerDetails();
	}, [open, match]);

	if (!match) return null;

	const isPong = match.type === "pong";
	const isDino = match.type === "dino";
	const gameSession = match.details;
	const gameDate = new Date(
		gameSession?.created_at || Date.now()
	).toLocaleDateString();

	const userId = localStorage.getItem("userId");
	const userResult = gameSession?.results?.find(
		(result) => result.player.user_id === userId
	);
	const result = userResult?.is_winner
		? dict?.profile?.sections?.history?.win || "WIN"
		: dict?.profile?.sections?.history?.lose || "LOSE";

	const navigateToProfile = (userId: string | null) => {
		if (userId) {
			router.push(`/profile/${userId}`);
			onOpenChange(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[800px]">
				<DialogHeader className="animate-fadeIn">
					<DialogTitle className="font-pixel text-sm">
						{isPong
							? dict?.dialogs?.matchDetails?.pongTitle || "PONG MATCH DETAILS"
							: dict?.dialogs?.matchDetails?.dinoTitle || "DINO RUN DETAILS"}
					</DialogTitle>
					<DialogDescription className="font-pixel text-xs">
						{`${gameDate} • ${result}`}
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 animate-slideUp">
					<div className="space-y-2">
						<h3 className="font-pixel text-xs text-muted-foreground">
							{dict?.dialogs?.matchDetails?.playerScores || "PLAYER SCORES"}
						</h3>
						<div className="grid grid-cols-1 gap-2">
							{isLoading ? (
								<div className="text-center py-4 font-pixel text-xs">
									{dict?.dialogs?.matchDetails?.loading ||
										"Loading player details..."}
								</div>
							) : (
								gameSession?.results
									?.sort((a, b) => b.score - a.score)
									.map((result) => {
										const isCurrentUser = result.player.user_id === userId;
										const isHuman = !result.player.is_bot;

										const enhancedData =
											isHuman && result.player.user_id
												? playerData[result.player.user_id]
												: null;

										const displayName =
											enhancedData?.username || result.player.username;
										const avatarUrl =
											enhancedData?.avatar || result.player.avatar;

										return (
											<div
												key={result.id}
												className={`flex justify-between items-center p-2 ${
													isCurrentUser ? "bg-primary/10" : "bg-muted/50"
												} rounded-md`}
											>
												<div className="flex items-center space-x-4">
													<div
														className={`w-8 h-8 rounded-full overflow-hidden bg-muted flex items-center justify-center ${
															isHuman && result.player.user_id
																? "cursor-pointer"
																: ""
														}`}
														onClick={() =>
															isHuman &&
															result.player.user_id &&
															navigateToProfile(result.player.user_id)
														}
													>
														{result.player.is_bot ? (
															<img
																src="/images/bot.png"
																alt="Bot avatar"
																className="w-full h-full object-cover"
															/>
														) : avatarUrl ? (
															<img
																src={avatarUrl}
																alt={`${displayName}'s avatar`}
																className="w-full h-full object-cover"
																onError={(e) => {
																	e.currentTarget.src =
																		"/images/default-avatar.png";
																}}
															/>
														) : (
															<div className="w-full h-full bg-primary/20 flex items-center justify-center">
																<span className="font-pixel text-xs">
																	{displayName.charAt(0).toUpperCase()}
																</span>
															</div>
														)}
													</div>
													<div>
														<p className="font-pixel text-xs flex items-center gap-2">
															{isHuman ? (
																<span
																	className={
																		result.player.user_id
																			? "cursor-pointer hover:underline transition-all"
																			: ""
																	}
																	onClick={() =>
																		result.player.user_id &&
																		navigateToProfile(result.player.user_id)
																	}
																>
																	{displayName}
																</span>
															) : (
																displayName
															)}
															{result.player.is_bot && (
																<span className="bg-muted text-muted-foreground text-[8px] px-1 py-0.5 rounded">
																	{dict?.dialogs?.matchDetails?.bot || "BOT"}
																</span>
															)}
														</p>
													</div>
												</div>
												<div className="flex items-center space-x-4">
													<div className="flex flex-col items-end">
														<p className="font-pixel text-xs text-muted-foreground">
															{dict?.dialogs?.matchDetails?.score || "SCORE"}
														</p>
														<div className="flex items-center gap-2">
															<p
																className={`font-pixel text-xs font-bold ${isCurrentUser ? "text-game-blue" : ""}`}
															>
																{result.score}
															</p>
														</div>
													</div>
												</div>
											</div>
										);
									})
							)}
						</div>
					</div>

					<DialogFooter className="pt-4">
						<DialogClose asChild>
							<Button variant="outline" className="font-pixel text-xs mr-2">
								{dict?.common?.close || "CLOSE"}
							</Button>
						</DialogClose>
					</DialogFooter>
				</div>
			</DialogContent>
		</Dialog>
	);
}
