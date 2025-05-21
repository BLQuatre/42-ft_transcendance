export enum GameType {
	PONG = "pong",
	DINO = "dino",
}

export enum GameResult {
	WIN = "win",
	LOSE = "lose",
}

export interface BaseGame {
	type: GameType;
	date: string;
}

export interface DinoGame extends BaseGame {
	type: GameType.DINO;
	score: number;
	distance: number;
}

export interface PongGame extends BaseGame {
	type: GameType.PONG;
	score: string;
	result: GameResult;
	opponent: string; // TODO: change to User and list
}

export type Game = PongGame | DinoGame;
