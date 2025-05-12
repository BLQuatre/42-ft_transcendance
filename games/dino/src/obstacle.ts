const FPS = 30 ;
const SCREEN_WIDTH = 800 ;
const OBSTCL_BASE_SPD = 5 ;
const SPD_SCALE_DIV = 30 ;

export class Obstacle {
	private x_pos: number ;
	private score: number ; // Used to know how fast the obstacle should move

	private frameCount = 0 ;


	constructor(score: number) {
		this.x_pos = SCREEN_WIDTH ;
		this.score = score ;

		this.autoUpdate() ;
	}

	private autoUpdate() {
		const interval = 1000 / FPS ;
	
		setInterval(() => {
			if (this.frameCount === 0) this.score++ ;
			this.frameCount = ((this.frameCount + 1) % 3) ;
	
			this.x_pos -= OBSTCL_BASE_SPD + OBSTCL_BASE_SPD * Math.log(1.3 + (this.score / SPD_SCALE_DIV)) ;
		}, interval) ;
	}


	get_x_pos() { return this.x_pos ; }
}
