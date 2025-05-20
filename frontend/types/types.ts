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

export interface User {
	username: string;
	displayName: string;
	avatar: string;
	joinDate: string;
	bio: string;
	stats: UserStats;
	gameStats: {
		pong: PongGameStats;
		dino: DinoGameStats;
	};
	recentGames: Game[];
}

export interface UserStats {
	totalGames: number;
	winRate: string;
	highScore: number;
}

export interface PongGameStats {
	played: number;
	wins: number;
	losses: number;
	winRate: string;
	highScore: string;
}

export interface DinoGameStats {
	played: number;
	highScore: number;
	avgScore: number;
	totalDistance: string;
}

export enum Language {
	ENGLISH = "en",
	FRENCH = "fr",
	MOLDAVIAN = "ro",
	RUSSIAN = "ru",
}

export enum UserStatus {
	ONLINE = "online",
	OFFLINE = "offline"
}

export interface Friend {
	username: string;
	avatar: string;
	status: UserStatus;
}

export enum ItemStatus {
	BUY = "buy",
	BOUGHT = "bought",
	SELECTED = "selected"
}

export enum ItemType {
	SKIN = "skin",
	MAP = "map"
}

export interface BuyableItem {
	id: string;
	name: string;
	description: string;
	image: string;
	price: number;
	status: ItemStatus;
}

export interface SkinItem extends BuyableItem {
}

export interface MapItem extends BuyableItem {
	game: GameType;
}

export interface Range {
	top: number ;
	bot: number ;
}

export interface Ball {
	x: number ;
	y: number ;
	vx: number ;
	vy: number ;
}

export interface PongState {
	left_team: {
		score: number;
		players: Range[];
	};
	right_team: {
		score: number;
		players: Range[];
	};
	ball: {
		x: number;
		y: number;
	};
}
