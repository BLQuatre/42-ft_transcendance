import { Team, Ball, State } from './types' ;
import { Player } from './player' ;
import * as CONST from './constants' ;

export class Game {
	private left_team: Team ; private right_team: Team ;
	private ball: Ball = {} as Ball ;
	private finished: boolean ;

	private intervalID: NodeJS.Timeout | null = null ;

	constructor() {
		this.left_team	= { players: [] , score: 0 } ;
		this.right_team	= { players: [] , score: 0 } ;
		this.finished = false ;
		this.resetBall() ;
	}

	startUpdating() {
		const interval = 1000 / CONST.FPS ;

		this.intervalID = setInterval(() => this.update(), interval) ;
	}

	stopUpdating() {
		if (this.intervalID !== null) {
			clearInterval(this.intervalID) ;
			this.intervalID = null ; // optional, but good practice
		}
	}


	getNumberPlayer(): number {
		return (this.left_team.players.length + this.right_team.players.length) ;
	}

	getPlayerById(id: number): Player | undefined {
		return [...this.left_team.players, ...this.right_team.players].find((player) => player.getId() === id);
	}

	isFinished(): boolean {
		return (this.finished) ;
	}

	getState(): State {
		return {
			left_team: {
				score: this.left_team.score,
				players: this.left_team.players.map((player) => ({
					top: player.getPaddle().top,
					bot: player.getPaddle().bot,
				})),
			},
			right_team: {
				score: this.right_team.score,
				players: this.right_team.players.map((player) => ({
					top: player.getPaddle().top,
					bot: player.getPaddle().bot,
				})),
			},
			ball: {
				x: this.ball.x,
				y: this.ball.y,
			},
		} ;
	}

	addPlayer(player: Player) {
		let team = (this.left_team.players.length > this.right_team.players.length) ? this.right_team : this.left_team ;

		team.players.push(player) ;

		const	areaSize	= CONST.BOARD_HEIGHT / team.players.length ;
		let		areaBegin	= 0 ;

		team.players.forEach(player => {
			player.resizeZone(areaBegin, (areaBegin + areaSize)) ;

			const areaCenter = (player.getZone().top + player.getZone().bot) / 2 ;
			const playerPaddleSize = (CONST.PADDLE_SIZE / team.players.length) ;

			player.resizePaddle((areaCenter - (playerPaddleSize / 2)), (areaCenter + (playerPaddleSize / 2))) ;

			areaBegin += areaSize ;
		}) ;
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
		this.left_team.players.forEach(player => {
			if (this.ball.x <= CONST.PADDLE_WIDTH && this.ball.vx < 0)
				this.paddleCollision(player) ;
		}) ;

		// Paddle collision for right team
		this.right_team.players.forEach(player => {
			if (this.ball.x >= (CONST.BOARD_LENGTH - CONST.PADDLE_WIDTH) && this.ball.vx > 0)
				this.paddleCollision(player) ;
		}) ;

		// Scoring
		if (this.ball.x < 0)
			this.scoring(this.left_team) ;
		if (this.ball.x > 800)
			this.scoring(this.right_team) ;
	}

	private paddleCollision(player: Player) {
		const paddle = player.getPaddle() ;
		if (this.ball.y > paddle.top && this.ball.y < paddle.bot) {
			const paddleCenter = (paddle.top + paddle.bot) / 2 ;
			const distanceFromCenter = this.ball.y - paddleCenter ;
			const normalizedOffset = distanceFromCenter / ((paddle.bot - paddle.top) / 2) ;

			// 1. Determine new direction
			const angle = normalizedOffset * (Math.PI / 4) ; // max ±45°
			const direction = this.ball.vx > 0 ? Math.PI - angle : angle ; // Reflect X

			// 2. Increase total speed
			let speed = Math.sqrt(this.ball.vx ** 2 + this.ball.vy ** 2) ;
			speed *= 1.05 ;

			// 3. Set new velocity vector with same speed, new angle
			this.ball.vx = Math.cos(direction) * speed ;
			this.ball.vy = Math.sin(direction) * speed ;
		}
	}

	private scoring(team: Team) {
		team.score += 1 ;
		if (team.score === CONST.SCORE_WIN) {
			this.stopUpdating()
			setTimeout(() => {
				this.finished = true ;
			}, 100) ;
		}
		this.resetBall() ;
	}

	private resetBall() {
		let angle: number ;

		// Avoid angles too close to horizontal or vertical (e.g., 0°, 90°, 180°, 270°)
		do {
			angle = Math.random() * 2 * Math.PI;
		} while (
			Math.abs(Math.cos(angle)) < 0.3 || // too vertical
			Math.abs(Math.sin(angle)) < 0.3    // too horizontal
		) ;

		this.ball.x = CONST.BOARD_LENGTH / 2 ;
		this.ball.y = CONST.BOARD_HEIGHT / 2 ;
		this.ball.vx = Math.cos(angle) * CONST.BALL_SPD ;
		this.ball.vy = Math.sin(angle) * CONST.BALL_SPD ;
	}
}
