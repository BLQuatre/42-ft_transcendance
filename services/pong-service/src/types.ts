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

export interface State {
	left_team: {
		score: number;
		players: Range[];
	};
	right_team: {
		score: number;
		players: Range[];
	};
	ball: {
		x: number;
		y: number;
	};
}
