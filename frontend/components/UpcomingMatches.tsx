"use client";

import Image from "next/image";
import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useDictionary } from "@/hooks/UseDictionnary";

type Player = {
	name: string;
};

type Match = {
	id: number;
	round: string;
	player1: Player;
	player2: Player;
	isLive: boolean;
};

type UpcomingMatchesProps = {
	matches: Match[];
	launchGame: () => void;
};

export function UpcomingMatches({ matches, launchGame }: UpcomingMatchesProps) {
	const dict = useDictionary();
	if (!dict) return null;

	return (
		<div className="space-y-4">
			{matches.length === 0 ? (
				<div className="text-center py-8">
					<p className="font-pixel text-sm text-muted-foreground uppercase">
						{dict.tournament.noUpcomingMatches}
					</p>
				</div>
			) : (
				matches.map((match) => {
					return (
						<div
							key={match.id}
							className={cn(
								"pixel-border border-2 rounded-md overflow-hidden",
								match.isLive ? `border-game-blue` : "border-muted"
							)}
						>
							<div
								className={`bg-game-blue/10 px-4 py-2 flex justify-between items-center`}
							>
								<div className="flex items-center">
									<Trophy className={`h-4 w-4 mr-2 text-game-blue`} />
									<span className="font-pixel text-xs uppercase">
										{match.round}
									</span>
								</div>
							</div>

							<div className="p-4">
								<div className="flex items-center justify-between">
									<div className="flex-1">
										<div className="flex items-center">
											<span className="font-pixel text-sm uppercase">
												{match.player1.name}
											</span>
										</div>
									</div>

									<div className="px-4">
										<div
											className={`font-pixel text-lg text-game-blue uppercase`}
										>
											VS
										</div>
									</div>

									<div className="flex-1 text-right">
										<div className="flex items-center justify-end">
											<span className="font-pixel text-sm uppercase">
												{match.player2.name}
											</span>
										</div>
									</div>
								</div>

								{match.isLive && (
									<div className="flex justify-center mt-4">
										<Button
											className={`font-pixel text-xs uppercase bg-game-blue hover:bg-game-blue/90`}
											onClick={launchGame}
										>
											{dict.tournament.playLocal}
										</Button>
									</div>
								)}
							</div>
						</div>
					);
				})
			)}
		</div>
	);
}
