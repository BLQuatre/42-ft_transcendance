import { GameState } from './types';

export class Game {
	state: GameState;

	constructor() {
		this.state = this.createInitialState();
	}

	private createInitialState(): GameState {
		return {
			paddle1: { y: 200 },
			paddle2: { y: 200 },
			ball: { x: 300, y: 200, vx: 4, vy: 4 },
		};
	}

	update() {
		const ball = this.state.ball;

		// Move ball
		ball.x += ball.vx;
		ball.y += ball.vy;

		// Collide with top/bottom
		if (ball.y <= 0 || ball.y >= 400) {	// Assuming 400px height
			ball.vy *= -1;
		}

		// TODO: Collide with paddles and score logic
	}
}
