import { Team, Ball, State } from './types';
import { Player } from './player';

const BOARD_LENGTH	= 800 ;
const BOARD_HEIGHT	= 600 ;
const PADDLE_LEFT	= 40 ;
const PADDLE_RIGHT	= 760 ;
const PADDLE_SIZE	= 100 ; // This represents the total length of all the paddles of a team, multiples members in the same team share this length

export class Game {
	left_team: Team ; right_team: Team ;
	ball: Ball ;

	constructor() {
		this.left_team	= { players: [] , score: 0 } ;
		this.right_team	= { players: [] , score: 0 } ;
		this.ball = { x: BOARD_LENGTH / 2 , y: BOARD_HEIGHT / 2 , vx: 5 , vy: 5 } ;
	}


	getNumberPlayer(): number {
		return (this.left_team.players.length + this.right_team.players.length) ;
	}

	getPlayerById(id: number): Player | undefined {
		return [ ... this.left_team.players, ... this.right_team.players]
			.find(player => player.id === id) ;
	}

	getState(): State {
		return {
			left_team: {
				score	: this.left_team.score,
				players	: this.left_team.players.map(player => ({
						top: player.paddle.top,
						bot: player.paddle.bot
					}))
			},
			right_team: {
				score	: this.right_team.score,
				players	: this.right_team.players.map(player => ({
						top: player.paddle.top,
						bot: player.paddle.bot
					}))
			},
			ball: {
				x: this.ball.x,
				y: this.ball.y
			}
		} ;
	}

	addPlayer(player: Player) {
		let team = (this.left_team.players.length > this.right_team.players.length) ? this.right_team : this.left_team ;

		team.players.push(player) ;

		const	areaSize	= BOARD_HEIGHT / team.players.length ;
		let		areaBegin	= 0 ;

		team.players.forEach(player => {
			player.resizeZone(areaBegin, (areaBegin + areaSize)) ;

			const areaCenter = (player.zone.top + player.zone.bot) / 2 ;
			const playerPaddleSize = (PADDLE_SIZE / team.players.length) ;

			player.resizePaddle((areaCenter - (playerPaddleSize / 2)), (areaCenter + (playerPaddleSize / 2))) ;

			areaBegin += areaSize ;
		}) ;
	}

	update() {
		// Move ball
		this.ball.x += this.ball.vx;
		this.ball.y += this.ball.vy;

		// Paddle collision for top/bottom borders
		if (this.ball.y <= 0 || this.ball.y >= BOARD_HEIGHT) {
			this.ball.vy *= -1;
		}

		// Paddle collision for left team
		this.left_team.players.forEach(player => {
			if (this.ball.x <= PADDLE_LEFT && this.ball.vx < 0)
				this.paddleCollision(player) ;
		}) ;

		// Paddle collision for right team
		this.right_team.players.forEach(player => {
			if (this.ball.x >= PADDLE_RIGHT && this.ball.vx > 0)
				this.paddleCollision(player) ;
		}) ;

		// Scoring
		if (this.ball.x < 0)
			this.scoring(this.left_team) ;
		if (this.ball.x > 800)
			this.scoring(this.right_team) ;
	}

	paddleCollision(player: Player) {
		if (this.ball.y > player.paddle.top && this.ball.y < player.paddle.bot) {
			const paddleCenter = (player.paddle.top + player.paddle.bot) / 2 ;
			const distanceFromCenter = this.ball.y - paddleCenter ;
			const normalizedOffset = distanceFromCenter / ((player.paddle.bot - player.paddle.top) / 2) ;

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

	scoring(team: Team) {
		team.score += 1 ;
		this.resetBall() ;
	}

	resetBall() {
		const speed = 7; // you can tweak this
		let angle: number;

		// Avoid angles too close to horizontal or vertical (e.g., 0°, 90°, 180°, 270°)
		do {
			angle = Math.random() * 2 * Math.PI;
		} while (
			Math.abs(Math.cos(angle)) < 0.3 || // too vertical
			Math.abs(Math.sin(angle)) < 0.3    // too horizontal
		);

		this.ball.x = BOARD_LENGTH / 2 ;
		this.ball.y = BOARD_HEIGHT / 2 ;
		this.ball.vx = Math.cos(angle) * speed;
		this.ball.vy = Math.sin(angle) * speed;
	}
}
