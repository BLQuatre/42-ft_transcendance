import { WebSocket } from 'ws';
import * as CONST from './constants' ;
import { Range } from './types' ;

export class Player {
	private id: number ;

	private x: Range ; // from left to right
	private y: Range ; // from bot to top
	
	private in_jump: boolean ; // true when jumping, false when falling or on the ground
	private leaning: boolean ;

	socket?: WebSocket ;
	
	private intervalID: NodeJS.Timeout | null = null ;


	constructor(id: number = 0, socket?: WebSocket) {
		this.id = id ;

		this.x = { from: CONST.DINO_POS, to: (CONST.DINO_POS + CONST.DINO_WIDTH) } ;
		this.y = { from: 0, to: CONST.DINO_HEIGHT } ;
		this.in_jump = false ;
		this.leaning = false ;

		this.socket = socket ;

		this.autoUpdate() ;
	}

	private autoUpdate() {
		const interval = 1000 / CONST.FPS ;
		
		this.intervalID = setInterval(() => {
			if (this.in_jump && this.y.from < CONST.JUMP_MAX_Y) {
				this.y.to += this.y.from < CONST.SLOW_ZONE_Y ? CONST.JUMP_SPEED : CONST.JUMP_SPEED / 3 ;
				this.y.from += this.y.from < CONST.SLOW_ZONE_Y ? CONST.JUMP_SPEED : CONST.JUMP_SPEED / 3 ;
			}
			else if (this.in_jump && this.y.from >= CONST.JUMP_MAX_Y)
				this.in_jump = false ;
			else if (!this.in_jump && this.y.from > 0) {
				this.y.to -= this.y.from < CONST.SLOW_ZONE_Y ? CONST.JUMP_SPEED : CONST.JUMP_SPEED / 3 ;
				this.y.from -= this.y.from < CONST.SLOW_ZONE_Y ? CONST.JUMP_SPEED : CONST.JUMP_SPEED / 3 ;
			}

			if (this.y.from > CONST.JUMP_MAX_Y) {
				this.y.from	= CONST.JUMP_MAX_Y ;
				this.y.to	= this.y.from + CONST.DINO_HEIGHT ;
			}
			if (this.y.from < 0) {
				this.y.from	= 0 ;
				this.y.to	= this.y.from + CONST.DINO_HEIGHT ;
			}

			if (Math.abs(this.y.to - this.y.from - CONST.DINO_HEIGHT) > 0.001 && Math.abs(this.y.to - this.y.from - (CONST.DINO_HEIGHT / 2)) > 0.001)
				console.log(`WARNING! from:${this.y.from} to:${this.y.to} diff:${this.y.to - this.y.from}`) ; // DEBUG
		}, interval) ;
	}

	stopUpdating() {
		if (this.intervalID !== null) {
			clearInterval(this.intervalID) ;
			this.intervalID = null ; // optional, but good practice
		}
	}
	
	
	
	get_id()		{ return this.id ; }
	get_x()			{ return this.x ; }
	get_y()			{ return this.y ; }
	get_leaning()	{ return this.leaning ; }
	
	jump() {
		if (this.y.from <= 0 && !this.leaning)
			this.in_jump = true ;
	}
	
	fall() {
		this.in_jump = false ;

		this.y.from	-= CONST.JUMP_SPEED / 3 ;
		this.y.to	-= CONST.JUMP_SPEED / 3 ;

		if (this.y.from < 0) {
			this.y.from	= 0 ;
			this.y.to	= this.y.from + CONST.DINO_HEIGHT ;
		}
	}

	lean() {
		if (this.y.from <= 0) {
			this.leaning = true ;
			this.y.to = this.y.from + (CONST.DINO_HEIGHT / 2) ;
		}
	}

	stand() {
		this.leaning = false ;
		this.y.to = this.y.from + CONST.DINO_HEIGHT ;
	}
}
