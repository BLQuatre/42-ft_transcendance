"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { useToast } from "@/hooks/UseToast";

type Player = {
	name: string;
	score: number | null;
};

type Match = {
	id: number;
	player1: Player;
	player2: Player;
	winner: string | null;
	completed: boolean;
};

type Round = {
	name: string;
	matches: Match[];
};

type BracketData = {
	rounds: Round[];
};

type TournamentBracketProps = {
	bracketData: BracketData;
	validateNames: (names: string[]) => void;
};

export function TournamentBracket({
	bracketData,
	validateNames,
}: TournamentBracketProps) {
	const [userNames, setUserNames] = useState<string[]>([
		"",
		"",
		"",
		"",
		"",
		"",
		"",
		"",
	]);
	const { toast } = useToast();

	const isEmptySlot = (playerName: string) => {
		return playerName === "";
	};

	const handleUsernameChange = (
		event: React.ChangeEvent<HTMLInputElement>,
		matchIndex: number,
		player: 1 | 2
	) => {
		const newUserNames = [...userNames];
		newUserNames[matchIndex * 2 + (player - 1)] = event.target.value
			.replace(/[^a-zA-Z0-9]/g, "")
			.slice(0, 12)
			.toUpperCase();
		setUserNames(newUserNames);
	};

	const checkNames = () => {
		if (!userNames.every((name) => name !== "")) {
			toast({
				title: "Error",
				description: "You need to enter all the players names",
				duration: 3000,
			});
			return;
		}
		if (!(userNames.length === new Set(userNames).size)) {
			toast({
				title: "Error",
				description: "You can't have duplicate names",
				duration: 3000,
			});
			return;
		}
		validateNames(userNames);
	};

	return (
		<>
			<div className="flex items-center justify-between mb-6">
				<h2 className={`font-pixel text-xl text-game-blue uppercase`}>
					Tournament Bracket
				</h2>
				<div className="px-6">
					{bracketData.rounds[0].matches.find(
						(match) => match.player1.name === "" || match.player2.name === ""
					) && (
						<Button onClick={checkNames} className="font-pixel uppercase">
							Start Tournament
						</Button>
					)}
				</div>
			</div>
			<div className={`bg-game-blue/5 rounded-lg p-6`}>
				<div className="overflow-x-auto pb-4">
					<div className="min-w-[600px] max-w-[800px] mx-auto">
						<div className="flex justify-between">
							{bracketData.rounds.map((round, roundIndex) => (
								<div
									key={roundIndex}
									className={cn(
										"flex flex-col",
										roundIndex > 0 && "ml-6",
										roundIndex < bracketData.rounds.length - 1 && "mr-6"
									)}
									style={{
										flex: 1,
										position: "relative",
										zIndex: 10 - roundIndex, // Ensure later rounds are on top for connector lines
									}}
								>
									<div
										className={`font-pixel text-xs text-game-blue uppercase mb-3 text-center`}
									>
										{round.name}
									</div>

									<div
										className="flex flex-col justify-around h-full"
										style={{
											gap: `${Math.pow(2, roundIndex) * 16}px`,
											marginTop: `${Math.pow(2, roundIndex - 1) * 8}px`,
											marginBottom: `${Math.pow(2, roundIndex - 1) * 8}px`,
										}}
									>
										{round.matches.map((match, matchIndex) => (
											<div
												key={match.id}
												className={cn(
													"relative",
													roundIndex < bracketData.rounds.length - 1 &&
														"connector-right",
													roundIndex > 0 && "connector-left"
												)}
											>
												<div
													className={cn(
														"pixel-border border-2 rounded-md overflow-hidden transition-all border-muted",
														match.completed ? "opacity-100" : "opacity-80"
													)}
												>
													{/* Player 1 */}
													<div
														className={cn(
															"flex justify-between items-center p-1.5",
															match.winner === match.player1.name
																? `bg-game-blue text-white`
																: "bg-muted/50",
															match.completed &&
																match.winner !== match.player1.name &&
																"text-muted-foreground",
															isEmptySlot(match.player1.name) && "bg-muted/30"
														)}
													>
														<div className="flex items-center justify-between w-full">
															<div className="">
																{roundIndex === 0 ? (
																	<>
																		{isEmptySlot(match.player1.name) ? (
																			<Input
																				id="username"
																				type="text"
																				autoComplete="username"
																				value={userNames[matchIndex * 2]}
																				onChange={(event) =>
																					handleUsernameChange(
																						event,
																						matchIndex,
																						1
																					)
																				}
																				required
																				className="font-pixel text-sm h-10 bg-muted"
																			/>
																		) : (
																			<span className="font-pixel text-xs uppercase truncate max-w-[100px]">
																				{" "}
																				{match.player1.name}{" "}
																			</span>
																		)}
																	</>
																) : (
																	<>
																		{isEmptySlot(match.player1.name) ? (
																			<span className="font-pixel text-xs uppercase truncate max-w-[100px] text-white/50">
																				WAITING FOR SCORE
																			</span>
																		) : (
																			<span className="font-pixel text-xs uppercase truncate max-w-[100px]">
																				{" "}
																				{match.player1.name}{" "}
																			</span>
																		)}
																	</>
																)}
															</div>

															{!isEmptySlot(match.player1.name) && (
																<span className="font-pixel text-xs font-bold ml-2">
																	{match.player1.score !== null
																		? match.player1.score
																		: "-"}
																</span>
															)}
														</div>
													</div>

													{/* Divider */}
													<div className="h-[1px] bg-muted w-full"></div>

													{/* Player 2 */}
													<div
														className={cn(
															"flex justify-between items-center p-1.5",
															match.winner === match.player2.name
																? `bg-game-blue text-white`
																: "bg-muted/50",
															match.completed &&
																match.winner !== match.player2.name &&
																"text-muted-foreground",
															isEmptySlot(match.player2.name) && "bg-muted/30"
														)}
													>
														<div className="flex items-center justify-between w-full">
															<div className="">
																{roundIndex === 0 ? (
																	<>
																		{isEmptySlot(match.player2.name) ? (
																			<Input
																				id="username"
																				type="text"
																				autoComplete="username"
																				value={userNames[matchIndex * 2 + 1]}
																				onChange={(event) =>
																					handleUsernameChange(
																						event,
																						matchIndex,
																						2
																					)
																				}
																				required
																				className="font-pixel text-sm h-10 bg-muted"
																			/>
																		) : (
																			<span className="font-pixel text-xs uppercase truncate max-w-[100px]">
																				{" "}
																				{match.player2.name}{" "}
																			</span>
																		)}
																	</>
																) : (
																	<>
																		{isEmptySlot(match.player2.name) ? (
																			<span className="font-pixel text-xs uppercase truncate max-w-[100px] text-white/50">
																				WAITING FOR SCORE
																			</span>
																		) : (
																			<span className="font-pixel text-xs uppercase truncate max-w-[100px]">
																				{" "}
																				{match.player2.name}{" "}
																			</span>
																		)}
																	</>
																)}
															</div>

															{!isEmptySlot(match.player2.name) && (
																<span className="font-pixel text-xs font-bold ml-2">
																	{match.player2.score !== null
																		? match.player2.score
																		: "-"}
																</span>
															)}
														</div>
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
