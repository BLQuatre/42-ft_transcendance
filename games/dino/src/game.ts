import { Player } from './player' ;
import { Obstacle } from './obstacle' ;

const FPS = 30 ;
const SCREEN_WIDTH = 800 ;
const CACTUSWIDTH = 30 ;
const MIN_OBSTCL_SPAN = 10 ;
const DIFFICULTY_COEFF = 20 ;

export class Game {
	score: number ; // Ramping up constantly, attributed to a player when he "loses"
	dinos: { player: Player, score: number }[] ;
	obstacles: Obstacle[] ;
	
	private frameCount = 0 ;
	private lastWasClose = false ;

	constructor() {
		this.score = 0 ;
		this.dinos = [] ;
		this.obstacles = [] ;

		this.autoUpdate() ;
	}
	
	// should start updating upon request instead of constructor
	private autoUpdate() {
		const interval = 1000 / FPS ;
	
		setInterval(() => {
			if (this.frameCount === 0)
				this.score++ ;
			this.frameCount = ((this.frameCount + 1) % 3) ;

			// see if a timeout before obstacles is needed
			this.handleObstacle() ;
		}, interval) ;
	}
	
	private handleObstacle() {
		if (this.canSpawnObstacle(this.obstacles.at(-1)?.get_x_pos() ?? 0) && Math.random() <= 0.01 + (Math.log(1 + this.score / (1000 * DIFFICULTY_COEFF))))
			this.obstacles.push(new Obstacle(this.score)) ;
	
		this.obstacles = this.obstacles.filter(obstacle => obstacle.get_x_pos() >= 0); // Erase off-screen obstacles
	}
	

	private canSpawnObstacle(lastObstaclePos: number): boolean {
		const canSpawnFar = lastObstaclePos < SCREEN_WIDTH - MIN_OBSTCL_SPAN * CACTUSWIDTH;
		const canSpawnClose = (
			lastObstaclePos < SCREEN_WIDTH - CACTUSWIDTH &&
			lastObstaclePos > SCREEN_WIDTH - 2 * CACTUSWIDTH &&
			!this.lastWasClose
		) ;

		if		(canSpawnClose)	this.lastWasClose = true ;
		else if	(canSpawnFar)	this.lastWasClose = false ;

		return canSpawnFar || canSpawnClose ;
	}


	getNumberPlayer() { return this.dinos.length ; }

	getPlayerById(id: number): Player | undefined { return this.dinos.find(dino => dino.player.get_id() === id)?.player ; }

	getState() {
		return {
			dinos: this.dinos.map(dino => ({
				y: dino.player.get_y_pos(),
				score: dino.score
			})),
			obstacles: this.obstacles.map(obstacle => ({
				x: obstacle.get_x_pos()
			}))
		}
	}

	addPlayer(player: Player) { this.dinos.push( { player: player, score: -1 } ) ; }
}
