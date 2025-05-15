import { WebSocket } from 'ws';
import { Range } from './types';

const FPS = 60 ;
const MOV_SPD = 6 ;

export class Player {
	id: number ;

	paddle: Range ;
	zone: Range ;

	moving: { up: boolean, down: boolean } ;

	socket?: WebSocket ; // TODO: check utility


	constructor(id: number = 0, socket?: WebSocket) {
		this.id = id ;

		this.paddle = { top: 0, bot: 0 } ;
		this.zone = { top: 0, bot: 0 } ;

		this.moving = { up: false, down: false } ;

		this.socket = socket ;

		this.autoUpdate() ;
	}

	autoUpdate() {
		const interval = 1000 / FPS ;

		setInterval(() => {
			if (this.moving.up)		this.move(-MOV_SPD) ;
			if (this.moving.down)	this.move(MOV_SPD) ;
		}, interval) ;
	}

	setMoveUp(up: boolean)		{ this.moving.up = up ; }
	setMoveDown(down: boolean)	{ this.moving.down = down ; }
	resizePaddle(top: number, bot: number)	{ this.paddle = { top: top, bot: bot} ; }
	resizeZone(top: number, bot: number)	{ this.zone = { top: top, bot: bot } ; }

	private move(distance: number) { // a negative 'distance' means moving up, positive means down
		this.paddle.top += distance ;
		this.paddle.bot += distance ;

		// Ensure being in the appropriate zone
		if (this.paddle.top < this.zone.top) {
			this.paddle.bot += this.zone.top - this.paddle.top ;
			this.paddle.top = this.zone.top ;
		}
		if (this.paddle.bot > this.zone.bot) {
			this.paddle.top += this.zone.bot - this.paddle.bot ;
			this.paddle.bot = this.zone.bot ;
		}
	}
}
