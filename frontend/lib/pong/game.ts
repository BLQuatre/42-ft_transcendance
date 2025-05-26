import { Player } from "./player";
import { Ball } from "@/types/types";
import * as CONST from "./constants";

export class Game {
	private Lplayer: Player;
	private Rplayer: Player;

	private ball: Ball = {} as Ball;
	private score: { left: number; right: number };

	private intervalID: NodeJS.Timeout | null = null;

	constructor() {
		this.Lplayer = new Player();
		this.Rplayer = new Player();
		this.resetBall();
		this.score = { left: 0, right: 0 };
	}

	startUpdating() {
		if (this.intervalID !== null) return;

		const interval = 1000 / CONST.FPS;

		this.intervalID = setInterval(() => this.update(), interval);
	}

	stopUpdating() {
		if (this.intervalID !== null) {
			clearInterval(this.intervalID);
			this.intervalID = null; // optional, but good practice
		}
	}

	get_Lplayer() {
		return this.Lplayer;
	}
	get_Rplayer() {
		return this.Rplayer;
	}
	get_ball() {
		return this.ball;
	}
	get_score() {
		return this.score;
	}

	private update() {
		// Move ball
		this.ball.x += this.ball.vx;
		this.ball.y += this.ball.vy;

		// Paddle collision for top/bottom borders
		if (this.ball.y <= 0 || this.ball.y >= CONST.BOARD_HEIGHT) {
			this.ball.vy *= -1;
		}

		// Paddle collision for left team
		if (this.ball.x <= CONST.PADDLE_WIDTH && this.ball.vx < 0)
			this.paddleCollision(this.Lplayer);

		// Paddle collision for right team
		if (
			this.ball.x >= CONST.BOARD_LENGTH - CONST.PADDLE_WIDTH &&
			this.ball.vx > 0
		)
			this.paddleCollision(this.Rplayer);

		// Scoring
		if (this.ball.x < 0) {
			this.score.right++;
			this.resetBall();
		}
		if (this.ball.x > 800) {
			this.score.left++;
			this.resetBall();
		}
	}

	private paddleCollision(player: Player) {
		const paddle = player.get_paddle();
		if (this.ball.y > paddle.top && this.ball.y < paddle.bot) {
			const paddleCenter = (paddle.top + paddle.bot) / 2;
			const distanceFromCenter = this.ball.y - paddleCenter;
			const normalizedOffset =
				distanceFromCenter / ((paddle.bot - paddle.top) / 2);

			// 1. Determine new direction
			const angle = normalizedOffset * (Math.PI / 4); // max ±45°
			const direction = this.ball.vx > 0 ? Math.PI - angle : angle; // Reflect X

			// 2. Increase total speed
			let speed = Math.sqrt(this.ball.vx ** 2 + this.ball.vy ** 2);
			speed *= 1.05;

			// 3. Set new velocity vector with same speed, new angle
			this.ball.vx = Math.cos(direction) * speed;
			this.ball.vy = Math.sin(direction) * speed;
		}
	}

	private resetBall() {
		let angle: number;

		// Avoid angles too close to horizontal or vertical (e.g., 0°, 90°, 180°, 270°)
		do {
			angle = Math.random() * 2 * Math.PI;
		} while (
			Math.abs(Math.cos(angle)) < 0.3 || // too vertical
			Math.abs(Math.sin(angle)) < 0.3 // too horizontal
		);

		this.ball.x = CONST.BOARD_LENGTH / 2;
		this.ball.y = CONST.BOARD_HEIGHT / 2;
		this.ball.vx = Math.cos(angle) * CONST.BALL_SPD;
		this.ball.vy = Math.sin(angle) * CONST.BALL_SPD;
	}
}
