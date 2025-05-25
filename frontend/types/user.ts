import { Game } from "./game";
import { DinoGameStats, PongGameStats, UserStats } from "./stats";

export enum UserStatus {
	ONLINE = "online",
	OFFLINE = "offline"
}

export interface BaseUser {
	id: string
	name: string
	avatar: string
	status: UserStatus
	created_at: string  // Add creation timestamp
	updated_at: string  // Add update timestamp
}

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
	created_at: string;  // Add creation timestamp
	updated_at: string;  // Add update timestamp
	tfaEnable: boolean;
}
