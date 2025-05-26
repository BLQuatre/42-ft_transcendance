"use client";

import { useEffect, useRef, useState } from "react";
import { MainNav } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/Card";
import BackToHomeButton from "@/components/BackToHome";
import { ScoreDisplay } from "@/components/ScoreDisplay";
import TournamentView, { TournamentData } from "@/components/TournamentView";
import { Trophy } from "lucide-react";

import { Game } from "@/lib/pong/game";
import * as CONST from "@/lib/pong/constants";

export default function PongGamePage() {
	const [tournamentData, setTournamentData] = useState<TournamentData | null>(
		null
	);
	const tournamentRef = useRef(tournamentData);
	useEffect(() => {
		tournamentRef.current = tournamentData;
	}, [tournamentData]);

	const gameRef = useRef<Game | null>(null);
	const [scores, setScores] = useState({ left: 0, right: 0 });
	const keysPressed = { w: false, s: false, up: false, down: false };

	const [pausedState, setPausedState] = useState<boolean>(true);
	const pausedRef = useRef(pausedState);

	const [gameFinished, setGameFinished] = useState<boolean>(false);
	const gameFinishedRef = useRef(gameFinished);

	const [showGame, setShowGame] = useState<boolean>(false);
	const [tournamentWinner, setTournamentWinner] = useState<string | null>(null);

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const frameRef = useRef<number | null>(null);

	useEffect(() => {
		setTournamentData({
			bracketData: {
				rounds: [
					{
						name: "Quarter-finals",
						matches: [
							{
								id: 1,
								game: new Game(),
								player1: { name: "", score: null },
								player2: { name: "", score: null },
								winner: null,
								completed: false,
							},
							{
								id: 2,
								game: new Game(),
								player1: { name: "", score: null },
								player2: { name: "", score: null },
								winner: null,
								completed: false,
							},
							{
								id: 3,
								game: new Game(),
								player1: { name: "", score: null },
								player2: { name: "", score: null },
								winner: null,
								completed: false,
							},
							{
								id: 4,
								game: new Game(),
								player1: { name: "", score: null },
								player2: { name: "", score: null },
								winner: null,
								completed: false,
							},
						],
					},
					{
						name: "Semi-finals",
						matches: [
							{
								id: 5,
								game: new Game(),
								player1: { name: "", score: null },
								player2: { name: "", score: null },
								winner: null,
								completed: false,
							},
							{
								id: 6,
								game: new Game(),
								player1: { name: "", score: null },
								player2: { name: "", score: null },
								winner: null,
								completed: false,
							},
						],
					},
					{
						name: "Final",
						matches: [
							{
								id: 7,
								game: new Game(),
								player1: { name: "", score: null },
								player2: { name: "", score: null },
								winner: null,
								completed: false,
							},
						],
					},
				],
			},
			upcomingMatches: [],
		});
	}, []);

	useEffect(() => {
		// update upcomingMatches every time bracketData is updated
		if (!tournamentRef.current) return;
		const updateUpcomingMatches = () => {
			const upcomingMatches: any[] = [];

			for (const round of tournamentRef.current!.bracketData.rounds) {
				for (const match of round.matches) {
					if (!match.completed && match.player1.name && match.player2.name) {
						upcomingMatches.push({
							id: match.id,
							round: round.name,
							player1: { name: match.player1.name },
							player2: { name: match.player2.name },
							isLive: upcomingMatches.length === 0, // First match is live
						});
					}
				}
			}

			setTournamentData((prev) =>
				prev
					? {
							...prev,
							upcomingMatches,
						}
					: null
			);
		};

		updateUpcomingMatches();
	}, [tournamentRef.current?.bracketData]);

	useEffect(() => {
		gameFinishedRef.current = gameFinished;

		if (gameFinished === true) setPausedState(true);
	}, [gameFinished]);

	useEffect(() => {
		if (!gameRef.current) return;

		const game = gameRef.current;
		pausedRef.current = pausedState;

		if (pausedState === true) game.stopUpdating();
		else game.startUpdating();
	}, [pausedState]);

	useEffect(() => {
		if (!canvasRef.current) return;

		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		if (!gameRef.current) return;

		const game = gameRef.current;

		const draw = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = "#1E1E1E";
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// Center dashed line
			ctx.strokeStyle = "#333";
			ctx.setLineDash([10, 10]);
			ctx.beginPath();
			ctx.moveTo(canvas.width / 2, 0);
			ctx.lineTo(canvas.width / 2, canvas.height);
			ctx.stroke();
			ctx.setLineDash([]);

			// Draw paddles
			const offset = 20;

			const Lpaddle = game.get_Lplayer().get_paddle();
			ctx.fillStyle = "#4A9DFF";
			ctx.fillRect(offset, Lpaddle.top, offset, Lpaddle.bot - Lpaddle.top);

			const Rpaddle = game.get_Rplayer().get_paddle();
			ctx.fillStyle = "#FFA500";
			ctx.fillRect(
				canvas.width - offset * 2,
				Rpaddle.top,
				offset,
				Rpaddle.bot - Rpaddle.top
			);

			// Draw ball
			const ball = game.get_ball();
			ctx.beginPath();
			ctx.fillStyle = "#FFFFFF";
			ctx.arc(ball.x, ball.y, 10, 0, Math.PI * 2);
			ctx.fill();
		};

		const handleInput = () => {
			if (pausedRef.current === true) return;

			// left player
			if (keysPressed.w) game.get_Lplayer().move(true);
			if (keysPressed.s) game.get_Lplayer().move(false);
			// right player
			if (keysPressed.up) game.get_Rplayer().move(true);
			if (keysPressed.down) game.get_Rplayer().move(false);
		};

		const gameLoop = () => {
			draw();
			handleInput();

			const currentScores = game.get_score();
			if (
				currentScores.left !== scores.left ||
				currentScores.right !== scores.right
			) {
				setScores({ left: currentScores.left, right: currentScores.right });
			}

			if (
				game.get_score().left == CONST.SCORE_WIN ||
				game.get_score().right == CONST.SCORE_WIN
			) {
				setGameFinished(true);

				// Update tournament data when game finishes
				updateTournamentAfterGame(currentScores);

				setTimeout(() => {
					setShowGame(false);
					gameRef.current = null;
				}, 5000);
			}

			if (gameFinishedRef.current === false)
				frameRef.current = requestAnimationFrame(gameLoop);
		};
		frameRef.current = requestAnimationFrame(gameLoop);

		const keydown = (e: KeyboardEvent) => {
			if (e.key === "w") keysPressed.w = true;
			if (e.key === "s") keysPressed.s = true;
			if (e.key === "ArrowUp") keysPressed.up = true;
			if (e.key === "ArrowDown") keysPressed.down = true;

			if (e.key === "p" && gameFinishedRef.current === false)
				setPausedState((prev) => !prev);
		};
		const keyup = (e: KeyboardEvent) => {
			if (e.key === "w") keysPressed.w = false;
			if (e.key === "s") keysPressed.s = false;
			if (e.key === "ArrowUp") keysPressed.up = false;
			if (e.key === "ArrowDown") keysPressed.down = false;
		};

		window.addEventListener("keydown", keydown);
		window.addEventListener("keyup", keyup);

		return () => {
			cancelAnimationFrame(frameRef.current!);
			window.removeEventListener("keydown", keydown);
			window.removeEventListener("keyup", keyup);
		};
	}, [gameRef.current]);

	const validateNames = (names: string[]) => {
		if (!tournamentData) return;

		const updatedTournamentData = {
			...tournamentData,
			bracketData: {
				...tournamentData.bracketData,
				rounds: tournamentData.bracketData.rounds.map((round, roundIndex) => {
					if (roundIndex === 0) {
						return {
							...round,
							matches: round.matches.map((match, i) => ({
								...match,
								player1: { ...match.player1, name: names[i * 2] },
								player2: { ...match.player2, name: names[i * 2 + 1] },
							})),
						};
					}
					return round;
				}),
			},
		};

		setTournamentData(updatedTournamentData);
	};

	const launchGame = () => {
		if (!tournamentData) return;

		// Find the live match in upcoming matches
		const liveMatch = tournamentData.upcomingMatches.find(
			(match) => match.isLive
		);
		if (!liveMatch) return;

		// Find the corresponding Game instance in bracketData using the match id
		let gameInstance: Game | null = null;
		for (const round of tournamentData.bracketData.rounds) {
			for (const match of round.matches) {
				if (match.id === liveMatch.id) {
					gameInstance = match.game;
					break;
				}
			}
			if (gameInstance) break;
		}

		if (gameInstance) {
			gameRef.current = gameInstance;
			setShowGame(true);
			setPausedState(true);
			setGameFinished(false);
			setScores({ left: 0, right: 0 });
		}
	};

	const updateTournamentAfterGame = (finalScores: {
		left: number;
		right: number;
	}) => {
		if (!tournamentData) return;

		// Find the live match
		const liveMatch = tournamentData.upcomingMatches.find(
			(match) => match.isLive
		);
		if (!liveMatch) return;

		// Determine winner
		const winner =
			finalScores.left === CONST.SCORE_WIN
				? liveMatch.player1.name
				: liveMatch.player2.name;

		setTournamentData((prev) => {
			if (!prev) return null;

			const updatedBracketData = {
				...prev.bracketData,
				rounds: prev.bracketData.rounds.map((round) => ({
					...round,
					matches: round.matches.map((match) => {
						if (match.id === liveMatch.id) {
							return {
								...match,
								player1: { ...match.player1, score: finalScores.left },
								player2: { ...match.player2, score: finalScores.right },
								winner: winner,
								completed: true,
							};
						}
						return match;
					}),
				})),
			};

			// Immediately advance winner to next round
			const advanceWinner = (rounds: any[]) => {
				// Find which round the completed match is in
				let currentRoundIndex = -1;
				let completedMatchIndex = -1;

				for (let i = 0; i < rounds.length; i++) {
					const matchIndex = rounds[i].matches.findIndex(
						(m: any) => m.id === liveMatch.id
					);
					if (matchIndex !== -1) {
						currentRoundIndex = i;
						completedMatchIndex = matchIndex;
						break;
					}
				}

				// If there's a next round, advance the winner
				if (currentRoundIndex !== -1 && currentRoundIndex < rounds.length - 1) {
					const nextRound = rounds[currentRoundIndex + 1];
					const nextMatchIndex = Math.floor(completedMatchIndex / 2);

					if (nextMatchIndex < nextRound.matches.length) {
						const nextMatch = nextRound.matches[nextMatchIndex];
						const isFirstPlayerSlot = completedMatchIndex % 2 === 0;

						// Add winner to the appropriate slot in the next match
						nextRound.matches[nextMatchIndex] = {
							...nextMatch,
							player1: isFirstPlayerSlot
								? { name: winner, score: null }
								: nextMatch.player1,
							player2: !isFirstPlayerSlot
								? { name: winner, score: null }
								: nextMatch.player2,
						};
					}
				} else if (currentRoundIndex === rounds.length - 1) {
					// This was the final match, set tournament winner
					setTournamentWinner(winner);
				}

				return rounds;
			};

			const updatedRounds = advanceWinner(updatedBracketData.rounds);

			return {
				...prev,
				bracketData: {
					...updatedBracketData,
					rounds: updatedRounds,
				},
			};
		});
	};

	if (!showGame) {
		return (
			<div className="min-h-screen bg-background">
				<MainNav />
				<div className="relative">
					<TournamentView
						tournamentData={tournamentData}
						validateNames={validateNames}
						launchGame={launchGame}
					/>

					{/* Tournament Winner Overlay */}
					{tournamentWinner && (
						<>
							{/* Blur overlay - only applies to content below navbar */}
							<div
								className="absolute inset-0 z-40"
								style={{ backdropFilter: "blur(8px)" }}
							></div>

							{/* Fixed overlay that covers entire viewport */}
							<div
								className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
								style={{ top: "64px" }}
							>
								<div className="text-center">
									<div className="animate-bounce mb-4">
										<Trophy className="h-24 w-24 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.8)] mx-auto" />
									</div>
									<div className="font-pixel text-4xl text-yellow-400 drop-shadow-[0_0_4px_rgba(0,0,0,1)] mb-2">
										{tournamentWinner.toUpperCase()}
									</div>
									<div className="font-pixel text-2xl text-white drop-shadow-[0_0_2px_rgba(0,0,0,1)] mb-8">
										WON THE TOURNAMENT!
									</div>
								</div>

								{/* Back to home button with container width */}
								<div className="px-6">
									<BackToHomeButton gameType="pong" />
								</div>
							</div>

							{/* Prevent scrolling */}
							<style>{`body { overflow: hidden; }`}</style>
						</>
					)}
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background flex flex-col h-screen overflow-hidden">
			<MainNav />

			<div className="flex-1 container py-6 relative">
				<div className="grid gap-8 relative">
					<div className="space-y-4">
						<Card className="overflow-hidden relative">
							<CardContent className="p-0">
								<canvas
									ref={canvasRef}
									width={800}
									height={500}
									className="w-full h-auto bg-game-dark pixel-border"
								/>

								{/* Score display component */}
								<ScoreDisplay
									leftScore={scores.left}
									rightScore={scores.right}
									winningScore={CONST.SCORE_WIN}
									gameFinished={gameFinished}
									isTournament={true}
								/>

								{/* Blur overlay applied only to game area */}
								{pausedState && (
									<div
										className="absolute inset-0 z-10"
										style={{ backdropFilter: "blur(8px)" }}
									></div>
								)}

								{/* Pause instructions on top of blur */}
								{pausedState && !gameFinished && (
									<div className="absolute inset-0 flex flex-col items-center justify-center z-20">
										<div className="text-white text-center">
											<h2 className="text-3xl font-bold mb-4 animate-pulse">
												Press P to play/pause
											</h2>
											<div className="text-sm opacity-80">
												<p>Left : use W/S to move your paddle</p>
												<p>Right : use ↑/↓ to move your paddle</p>
											</div>
										</div>
									</div>
								)}
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
