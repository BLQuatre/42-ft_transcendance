import { Player } from './player';
import { Game } from './game';

export class Room {
    private id: string;
    private players: Player[];
	private game?: Game;

    constructor(id: string) {
        this.id = id;
        this.players = [];
    }

    public getId() {
        return this.id;
    }

    public addPlayer(player: Player) {
        this.players.push(player);
    }

    public removePlayer(playerId: string) {
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
            status: this.game ? 'in-progress' : 'waiting',
        };
    }

    public getPlayers() {
        return this.players;
    }

    public getGame() {
        return this.game;
    }
}