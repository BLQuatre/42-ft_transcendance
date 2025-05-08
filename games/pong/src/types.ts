import { Player } from './player' ;

export interface Range {
	top: number ;
	bot: number ;
}

export interface Team {
	players: Player[] ;
	score: number ;
}

export interface Ball {
	x: number ;
	y: number ;
	vx: number ;
	vy: number ;
}
