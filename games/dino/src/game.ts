import { Player } from './player' ;

const FPS = 10 ;

export class Game {
	currentScore: number ; // Ramping up constantly, attributed to a player when he "loses"
	dinos: { player: Player, score: number }[] ;


	constructor() {
		this.currentScore = 0 ;
		this.dinos = [] ;

		this.autoUpdate() ;
	}
	
	private autoUpdate() {
		const interval = 1000 / FPS ;
	
		setInterval(() => {
			this.currentScore++ ;
		}, interval) ;
	}


	getNumberPlayer() { return this.dinos.length ; }

	getPlayerById(id: number): Player | undefined { return this.dinos.find(dino => dino.player.get_id() === id)?.player ; }

	getState() {
		return {
			dinos: this.dinos.map(dino => ({
				y: dino.player.get_y_pos(),
				score: dino.score
			}))
		}
	}

	addPlayer(player: Player) { this.dinos.push( { player: player, score: -1 } ) ; }
}
