import { Trophy } from "lucide-react"
import { useDictionary } from "@/hooks/UseDictionnary"
import BackToHomeButton from "./BackToHome"

interface ScoreDisplayProps {
	leftScore: number
	rightScore: number
	winningScore: number
	gameFinished: boolean
}

export function ScoreDisplay({ leftScore, rightScore, winningScore, gameFinished }: ScoreDisplayProps) {
  const dict = useDictionary()
  const leftWon = leftScore === winningScore
  const rightWon = rightScore === winningScore

	return (
		<>
			{/* Scores at the top */}
			<div className="absolute top-4 left-0 right-0 z-20">
				{/* Left score positioned in the middle of left half */}
				<div className="absolute left-1/4 -translate-x-1/2 flex flex-col items-center">
					<div className="text-[#4A9DFF] font-pixel text-2xl md:text-3xl font-bold">{leftScore}</div>
				</div>

				{/* Right score positioned in the middle of right half */}
				<div className="absolute left-3/4 -translate-x-1/2 flex flex-col items-center">
					<div className="text-[#FFA500] font-pixel text-2xl md:text-3xl font-bold">{rightScore}</div>
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
					<BackToHomeButton gameType="pong" className="absolute bottom-4 left-4 right-4"/>
				</div>
			)}
		</>
	)
}
