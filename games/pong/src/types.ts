export interface Paddle {
		y: number;
}

export interface Ball {
	x: number;
	y: number;
	vx: number;
	vy: number;
}

export interface GameState {
	paddle1: Paddle;
	paddle2: Paddle;
	ball: Ball;
}
