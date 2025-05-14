import { WebSocket } from 'ws';
import * as CONST from './constants' ;

export class Player {
	private id: number ;

	private y_pos: number ;
	private in_jump: boolean ; // true when jumping, false when falling or on the ground

	socket?: WebSocket ;


	constructor(id: number = 0, socket?: WebSocket) {
		this.id = id ;

		this.y_pos = 0 ;
		this.in_jump = false ;

		this.socket = socket ;

		this.autoUpdate() ;
	}

	private autoUpdate() {
		const interval = 1000 / CONST.FPS ;
		
		setInterval(() => {
			if (this.in_jump && this.y_pos < CONST.JUMP_MAX_Y)
				this.y_pos += this.y_pos < CONST.FAST_ZONE_Y ? CONST.JUMP_SPEED : CONST.JUMP_SPEED / 3 ;
			else if (this.in_jump && this.y_pos >= CONST.JUMP_MAX_Y)
				this.in_jump = false ;
			else if (!this.in_jump && this.y_pos > 0)
				this.y_pos -= this.y_pos < CONST.FAST_ZONE_Y ? CONST.JUMP_SPEED : CONST.JUMP_SPEED / 3 ;

			if (this.y_pos > CONST.JUMP_MAX_Y)	this.y_pos = CONST.JUMP_MAX_Y ;
			if (this.y_pos < 0)		this.y_pos = 0 ;
		}, interval) ;
	}
	
	
	get_id() { return this.id ; }
	get_y_pos() { return this.y_pos ; }
	
	jump() {
		if (this.y_pos <= 0)
			this.in_jump = true ;
	}
	
	fall() {
		this.in_jump = false ;

		this.y_pos -= CONST.JUMP_SPEED / 3 ;
		if (this.y_pos < 0) this.y_pos = 0 ;
	}
}
