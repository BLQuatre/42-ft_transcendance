import { Player } from './player';
import { Game } from './game';

export class Room {
    private id: string;
    private players: Player[];
	private game?: Game;
    private isGameInProgress: boolean;

    constructor(id: string, players: Player[] = [], isGameInProgress: boolean = false) {
        this.id = id;
        this.players = players;
        this.isGameInProgress = isGameInProgress;
    }

    public getId() {
        return this.id;
    }

    public addPlayer(player: Player) {
        this.players.push(player);
    }

    public removePlayer(playerId: number) {
        this.players = this.players.filter((p) => p.getId() !== playerId);
    }

	public launchGame() {
		this.game = new Game();
		
		this.getPlayers().forEach((player) => this.game!.addPlayer(player));

		this.game.startUpdating();
	}

    public getRoomState() {
        return {
            id: this.id,
            players: this.players.map((p) => ({
                id: p.getId(),
                name: `Player ${p.getId()}`,
                isReady: p.isReady(),
            })),
            status: this.isGameInProgress ? 'in-progress' : 'waiting',
        };
    }

    public getPlayers() {
        return this.players;
    }

    public isGameRunning() {
        return this.isGameInProgress;
    }

    public getGame() {
        return this.game;
    }

    public setGameInProgress(status: boolean) {
        this.isGameInProgress = status;
    }
}