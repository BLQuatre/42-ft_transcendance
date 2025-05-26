export interface Range {
	top: number ;
	bot: number ;
}

export interface Ball {
	x: number ;
	y: number ;
	vx: number ;
	vy: number ;
}

export interface PongState {
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

export enum ToastVariant {
	DEFAULT = "default",
	SUCCESS = "success",
	ERROR = "error",
	WARNING = "warning",
	INFO = "info",
	DESTRUCTIVE = "destructive"
}