import { WebSocket } from 'ws';
import { Range } from './types' ;
import * as CONST from './constants' ;


export class Player {
	private id: string ;
	private name: string ;

	private x: Range ; // from left to right
	private y: Range ; // from bot to top
	
	private in_jump: boolean ; // true when jumping, false when falling or on the ground
	private leaning: boolean ;

    private ready: boolean;
	private socket?: WebSocket ;
	
	private intervalID: NodeJS.Timeout | null = null ;


	constructor(id: string, name: string, socket?: WebSocket) {
		this.id = id ;
		this.name = name;

		this.x = { from: CONST.DINO_POS, to: (CONST.DINO_POS + CONST.DINO_WIDTH) } ;
		this.y = { from: 0, to: CONST.DINO_HEIGHT } ;
		this.in_jump = false ;
		this.leaning = false ;

		this.socket = socket ;

		this.ready = false ;

		this.startUpdating() ;
	}

	private startUpdating() {
		const interval = 1000 / CONST.FPS ;
		
		this.intervalID = setInterval(() => { this.autoUpdate() }, interval) ;
	}

	stopUpdating() {
		if (this.intervalID !== null) {
			clearInterval(this.intervalID) ;
			this.intervalID = null ; // optional, but good practice
		}
	}

	private autoUpdate() {
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
	}
	
	
	getId()			{ return this.id ; }
	getName()		{ return this.name ; }
	getX()			{ return this.x ; }
	getY()			{ return this.y ; }
	getLeaning()	{ return this.leaning ; }
	isReady()		{ return this.ready ; }
	getSocket()		{ return this.socket ; }

    toggleReadyState() {
        this.ready = !this.ready;
    }
	
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
