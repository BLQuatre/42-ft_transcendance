import * as CONST from './constants' ;
import { Range } from './types' ;

export class Obstacle {
	private type: number ;
	private x: Range ; // from left to right
	private y: Range ; // from bot to top

	private score: number ; // Used to know how fast the obstacle should move

	private frameCount = 0 ;


	constructor(type: 1 | 2 | 3 | 4, score: number) {
		this.type = type ;

		switch (type) {
			case CONST.TYPE_CACTUS:
				this.x = { from: CONST.SCREEN_WIDTH, to: (CONST.SCREEN_WIDTH + CONST.CACTUS_WIDTH) } ;
				this.y = { from: 0, to: CONST.CACTUS_HEIGHT } ;
				break ;
			case CONST.TYPE_GROUP:
				this.x = { from: CONST.SCREEN_WIDTH, to: (CONST.SCREEN_WIDTH + CONST.GROUP_WIDTH) } ;
				this.y = { from: 0, to: CONST.GROUP_HEIGHT } ;
				break ;
			case CONST.TYPE_SMALL:
				this.x = { from: CONST.SCREEN_WIDTH, to: (CONST.SCREEN_WIDTH + CONST.SMALL_WIDTH) } ;
				this.y = { from: 0, to: CONST.SMALL_HEIGHT } ;
				break ;
			default: // PTERO
				this.x = { from: CONST.SCREEN_WIDTH, to: (CONST.SCREEN_WIDTH + CONST.PTERO_WIDTH) } ;
				this.y = { from: 0, to: CONST.PTERO_HEIGHT } ;
				if (Math.random() > 0.5) {
					this.y.from += CONST.PTERO_POS ;
					this.y.to += CONST.PTERO_POS ;
				}
				break ;
		}
		
		this.score = score ;

		this.autoUpdate() ;
	}

	private autoUpdate() {
		const interval = 1000 / CONST.FPS ;
	
		setInterval(() => {
			if (this.frameCount === 0) this.score++ ;
			this.frameCount = ((this.frameCount + 1) % 3) ;

			const speed = CONST.OBSTCL_BASE_SPD + CONST.OBSTCL_BASE_SPD * Math.log(1.3 + (this.score / CONST.SPD_SCALE_DIV)) ;
			this.x.from -= speed ; this.x.to -= speed ;
		}, interval) ;
	}


	get_x()		{ return this.x ; }
	get_y()		{ return this.y ; }
	get_type()	{ return this.type ; }
}
