import { Player } from './player' ;
import { Obstacle } from './obstacle' ;
import * as CONST from './constants' ;

export class Game {
	score:number = 0 ; // Ramping up constantly, attributed to a player when he "loses"
	dinos: { player: Player, score: number }[] = [] ;
	obstacles: Obstacle[] = [] ;
	
	private frameCount:number = 0 ;
	private isUpdating:boolean = false ;
	private lastWasClose:boolean = false ;


	autoUpdate() {
		if (this.isUpdating)
			return ;
		this.isUpdating = true ;

		const interval = 1000 / CONST.FPS ;
	
		setInterval(() => {
			if (this.frameCount === 0)
				this.score++ ;
			this.frameCount = ((this.frameCount + 1) % 3) ;

			// see if a timeout before obstacles is needed
			this.handleObstacle() ;
		}, interval) ;
	}
	
	private handleObstacle() {
		const spawn = Math.random() <= 0.01 + (Math.log(1 + this.score / (1000 * CONST.DIFFICULTY_COEFF))) ;
		
		if (spawn) {
			let rand_type = Math.random() ;
			let type: 1 | 2 | 3 | 4 ;
			
			if (rand_type < 0.5)		type = CONST.TYPE_CACTUS ;
			else if (rand_type < 0.7)	type = CONST.TYPE_SMALL ;
			else if (rand_type < 0.8)	type = CONST.TYPE_GROUP ;
			else						type = CONST.TYPE_PTERO ;
			

			if (this.canSpawnObstacle(type))
				this.obstacles.push(new Obstacle(type, this.score)) ;
		}
	
		this.obstacles = this.obstacles.filter(obstacle => obstacle.get_x().from >= 0); // Erase off-screen obstacles
	}
	

	private canSpawnObstacle(type: 1 | 2 | 3 | 4): boolean {
		const lastObstaclePos	= this.obstacles.at(-1)?.get_x()?.from ?? 0 ;
		const lastType 			= this.obstacles.at(-1)?.get_type() ?? 0 ;

		const canSpawnFar = lastObstaclePos < CONST.SCREEN_WIDTH - CONST.MIN_OBSTCL_SPAN * CONST.CACTUS_WIDTH;
		const canSpawnClose = (
			lastObstaclePos < CONST.SCREEN_WIDTH - CONST.CACTUS_WIDTH &&
			lastObstaclePos > CONST.SCREEN_WIDTH - 2 * CONST.CACTUS_WIDTH &&
			!this.lastWasClose &&
			type !== CONST.TYPE_PTERO && lastType !== CONST.TYPE_PTERO
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
				y: dino.player.get_y().from,
				lean: dino.player.get_leaning(),
				score: dino.score
			})),
			obstacles: this.obstacles.map(obstacle => ({
				x: obstacle.get_x().from,
				y: obstacle.get_y().to,
				type: obstacle.get_type()
			})),
			score: this.score
		}
	}

	addPlayer(player: Player) { this.dinos.push( { player: player, score: -1 } ) ; }
}
