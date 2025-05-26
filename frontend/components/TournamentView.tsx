import { TournamentBracket } from "@/components/TournamentBracket";
import { UpcomingMatches } from "@/components/UpcomingMatches";
import { Game } from "@/lib/pong/game"

type Player = {
	name: string;
	score: number | null;
	avatar?: string | null;
};

type Match = {
	id: number
	game: Game
	player1: Player;
	player2: Player;
	winner: string | null;
	completed: boolean;
	round?: string;
	isLive?: boolean;
};

type Round = {
	name: string;
	matches: Match[];
};

type BracketData = {
	rounds: Round[];
};

export type TournamentData = {
	bracketData: BracketData;
	upcomingMatches: any[];
};

interface TournamentViewProps {
	tournamentData: TournamentData | null;
	validateNames: (names: string[]) => void;
	launchGame: () => void
}

export default function TournamentView({ tournamentData, validateNames, launchGame }: TournamentViewProps) {
	if (!tournamentData) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="font-pixel text-lg animate-pulse">LOADING...</div>
			</div>
		);
	}

	return (
		<>
			<div className="container px-4 py-8 mx-auto">

				{/* Header Section */}
				<section className={`mb-12 pb-8 border-b border-game-blue/20`}>
					<div className="flex items-center justify-between mb-4"></div>
					<h1 className={`font-pixel text-2xl md:text-3xl text-game-blue uppercase mb-6`}>PONG TOURNAMENT</h1>
				</section>

				{/* Tournament Bracket Section */}
				<section className={`mb-12 pb-8 border-b border-game-blue/20`}>
					<TournamentBracket bracketData={tournamentData.bracketData} validateNames={validateNames} />
				</section>

				{/* Upcoming Matches Section */}
				<section className={`mb-12 pb-8 border-b border-game-blue/20`}>
					<div className="flex items-center justify-between mb-6">
						<h2 className={`font-pixel text-xl text-game-blue uppercase`}>Upcoming Matches</h2>
					</div>
					<div className={`bg-game-blue/5 rounded-lg p-6`}>
						<UpcomingMatches matches={tournamentData.upcomingMatches} launchGame={launchGame} />
					</div>
				</section>
			</div>
		</>
	);
};
