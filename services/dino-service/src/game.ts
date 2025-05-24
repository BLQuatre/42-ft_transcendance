import { Obstacle } from './obstacle' ;
import { Player } from './player' ;
import * as CONST from './constants' ;

import axios from 'axios' ;
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env.dev')});


export class Game {
	private score: number ; // Ramping up constantly, attributed to a player when he "loses"
	private dinos: { player: Player, score: number }[] ;
	private obstacles: Obstacle[] ;
	private finished: boolean ;
	
	private frameCount:number ; // Made for the score to scale every three frames only
	private lastWasClose:boolean ;

	private intervalID: NodeJS.Timeout | null = null ;

	constructor() {
		this.score = 0 ;
		this.dinos = [] ;
		this.obstacles = [] ;
		this.finished = false ;

		this.frameCount = 0 ;
		this.lastWasClose = false ;
	}

	startUpdating() {
		if (this.intervalID !== null) return ;
		
		const interval = 1000 / CONST.FPS ;
	
		this.intervalID = setInterval(() => {
			if (this.frameCount === 0)
				this.score++ ;
			this.frameCount = ((this.frameCount + 1) % 3) ;

			this.handleObstacle() ;
		}, interval) ;
	}

	stopUpdating() {
		if (this.intervalID !== null) {
			clearInterval(this.intervalID) ;
			this.intervalID = null ; // optional, but good practice
		}
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
	
		this.obstacles = this.obstacles.filter(obstacle => obstacle.getX().from >= 0); // Erase off-screen obstacles

		this.checkObstacles() ;
	}
	

	private canSpawnObstacle(type: 1 | 2 | 3 | 4): boolean {
		const lastObstaclePos	= this.obstacles.at(-1)?.getX()?.from ?? 0 ;
		const lastType 			= this.obstacles.at(-1)?.getType() ?? 0 ;

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

	isFinished(): boolean { return (this.finished) ; }

	getState() {
		return {
			dinos: this.dinos.map(dino => ({
				y: dino.player.getY().from,
				lean: dino.player.getLeaning(),
				score: dino.score
			})),
			obstacles: this.obstacles.map(obstacle => ({
				x: obstacle.getX().from,
				y: obstacle.getY().to,
				type: obstacle.getType()
			})),
			score: this.score
		}
	}

	addPlayer(player: Player) { this.dinos.push( { player: player, score: -1 } ) ; }

	checkObstacles() {
		if (this.dinos.length === 0)
			return ;

		this.obstacles.forEach(obstacle => {
			const obstacle_x = obstacle.getX() ;
			const first_dino_x = this.dinos.at(0)?.player.getX() ?? { from: 0, to: 0 } ;	// assuming every players share the same x (as it's not modifiable)
																							// still using ?? logic to make following code lighter
			
			if (!(obstacle_x.to > first_dino_x.from && obstacle_x.from < first_dino_x.to)) // checking collision between obstacle and dino (x-axis wise)
				return ;

			const obstacle_y = obstacle.getY() ;
			for (const dino of this.dinos) {
				if (dino.score > -1)
					continue ;

				const dino_y = dino.player.getY() ;

				if (obstacle_y.to > dino_y.from && obstacle_y.from < dino_y.to) { // checking collision between obstacle and dino (y-axis wise)
					dino.player.stopUpdating() ;
					dino.score = this.score ;
				}
			}
		}) ;

		if (this.dinos.find((dino) => dino.score === -1) === undefined) {
			this.endGame() ;
		}
	}

	private endGame() {
		this.stopUpdating() ;
	
		setTimeout(() => {
			this.finished = true ;
		}, 100) ;

		const highestScore = this.dinos.reduce((max, team) =>  Math.max(max, team.score), 0) ;
		
		const payload = {
			game_type: 'DINO',
			players: this.dinos.map((dino) => {
				return {
					user_id: dino.player.getId(),
					username: dino.player.getName(),
					is_bot: false,
					score: dino.score,
					is_winner: dino.score === highestScore,
				} ;
			}),
		} ;
		
		axios.post(`http://${process.env.GAMEH_HOST}:${process.env.GAMEH_PORT}/history`, payload) ;
	}
}
