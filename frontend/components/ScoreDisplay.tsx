import { Trophy } from "lucide-react";
import BackToHomeButton from "./BackToHome";

interface ScoreDisplayProps {
	leftScore: number;
	rightScore: number;
	winningScore: number;
	gameFinished: boolean;
	isTournament?: boolean;
}

export function ScoreDisplay({
	leftScore,
	rightScore,
	winningScore,
	gameFinished,
	isTournament = false,
}: ScoreDisplayProps) {
	const leftWon = leftScore === winningScore;
	const rightWon = rightScore === winningScore;
	const scoreFlames = leftScore * rightScore >= 42;

	return (
		<>
			{/* Fire animation styles */}
			<style>
				{`
					@keyframes flameDance {
						0% {
							transform: translateX(0) scaleY(1);
							opacity: 0.9;
						}
						25% {
							transform: translateX(-0.15em) scaleY(1.1);
							opacity: 1;
						}
						50% {
							transform: translateX(0.15em) scaleY(1.15);
							opacity: 0.85;
						}
						75% {
							transform: translateX(-0.1em) scaleY(1.1);
							opacity: 0.95;
						}
						100% {
							transform: translateX(0) scaleY(1);
							opacity: 0.9;
						}
					}
					
					.fire-container {
						position: relative;
						display: inline-block;
					}
					
					.flame-layer {
						position: absolute;
						bottom: 0%;
						left: 2%;
						transform: translateX(-50%);
						width: 1em;
						height: 1.5em;
						border-radius: 50% 50% 30% 30%;
						background: radial-gradient(circle, #fff066, #ff6600, #cc0000);
						animation: flameDance 1s infinite ease-in-out;
						opacity: 0.8;
						filter: blur(1px);
						z-index: 0;
					}
					
					.flame-layer:nth-child(2) {
						width: 0.8em;
						height: 1.2em;
						left: 0%;
						animation-delay: 0.15s;
					}
					
					.flame-layer:nth-child(3) {
						width: 1.1em;
						height: 1.8em;
						left: 4%;
						animation-delay: 0.3s;
					}
					
					.blue-flames .flame-layer {
						background: radial-gradient(circle, #a0d8ff, #4A9DFF, #0055cc);
					}
					
					.orange-flames .flame-layer {
						background: radial-gradient(circle, #ffe6b3, #FFA500, #cc5500);
					}
				`}
			</style>

			{/* Scores at the top */}
			<div className="absolute top-4 left-0 right-0 z-20">
				{/* Left score positioned in the middle of left half */}
				<div className="absolute left-1/4 -translate-x-1/2 flex flex-col items-center">
					<div className="text-[#4A9DFF] font-pixel text-2xl md:text-3xl font-bold fire-container blue-flames">
						{scoreFlames ? (
							<>
								<div className="flame-layer" />
								<div className="flame-layer" />
								<div className="flame-layer" />
								<div className="text-[#FFFFFF] relative z-10">
									{" "}
									{leftScore}{" "}
								</div>
							</>
						) : (
							<>
								<div className="relative z-10"> {leftScore} </div>
							</>
						)}
					</div>
				</div>

				{/* Right score positioned in the middle of right half */}
				<div className="absolute left-3/4 -translate-x-1/2 flex flex-col items-center">
					<div className="text-[#FFA500] font-pixel text-2xl md:text-3xl font-bold fire-container orange-flames">
						{scoreFlames ? (
							<>
								<div className="flame-layer" />
								<div className="flame-layer" />
								<div className="flame-layer" />
								<div className="text-[#FFFFFF] relative z-10">
									{" "}
									{rightScore}{" "}
								</div>
							</>
						) : (
							<>
								<div className="relative z-10"> {rightScore} </div>
							</>
						)}
					</div>
				</div>
			</div>

			{/* Trophies in the center of each side */}
			{gameFinished && (
				<div className="absolute inset-0 z-30">
					<div className="pointer-events-none">
						{/* Left trophy */}
						{leftWon && (
							<div className="absolute left-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-bounce">
								<Trophy className="h-16 w-16 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.7)]" />
								<span className="text-yellow-400 font-bold text-lg mt-2 font-pixel drop-shadow-[0_0_2px_rgba(0,0,0,1)]">
									WINNER!
								</span>
							</div>
						)}

						{/* Right trophy */}
						{rightWon && (
							<div className="absolute left-3/4 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-bounce">
								<Trophy className="h-16 w-16 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.7)]" />
								<span className="text-yellow-400 font-bold text-lg mt-2 font-pixel drop-shadow-[0_0_2px_rgba(0,0,0,1)]">
									WINNER!
								</span>
							</div>
						)}
					</div>

					{/* Back to home button at bottom of page */}
					{!isTournament && (
						<BackToHomeButton
							gameType="pong"
							className="absolute bottom-4 left-4 right-4"
						/>
					)}
				</div>
			)}
		</>
	);
}
