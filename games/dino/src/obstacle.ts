import * as CONST from './constants' ;

export class Obstacle {
	private x_pos: number ;
	private score: number ; // Used to know how fast the obstacle should move

	private frameCount = 0 ;


	constructor(score: number) {
		this.x_pos = CONST.SCREEN_WIDTH ;
		this.score = score ;

		this.autoUpdate() ;
	}

	private autoUpdate() {
		const interval = 1000 / CONST.FPS ;
	
		setInterval(() => {
			if (this.frameCount === 0) this.score++ ;
			this.frameCount = ((this.frameCount + 1) % 3) ;
	
			this.x_pos -= CONST.OBSTCL_BASE_SPD + CONST.OBSTCL_BASE_SPD * Math.log(1.3 + (this.score / CONST.SPD_SCALE_DIV)) ;
		}, interval) ;
	}


	get_x_pos() { return this.x_pos ; }
}
