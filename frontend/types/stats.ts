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
