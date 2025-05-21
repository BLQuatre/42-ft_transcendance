import { WebSocket } from 'ws';
import { Range } from './types';
import * as CONST from './constants';


export class Player {
    private id: number;
    private paddle: Range;
    private zone: Range;
    private moving: { up: boolean; down: boolean };
    private ready: boolean;
    private socket?: WebSocket;


    constructor(id: number = 0, socket?: WebSocket) {
        this.id = id;

        this.paddle = { top: 0, bot: 0 };
        this.zone = { top: 0, bot: 0 };

        this.moving = { up: false, down: false };

        this.socket = socket;

        this.ready = false;

        this.autoUpdate();
    }

    private autoUpdate() {
        const interval = 1000 / CONST.FPS;

        setInterval(() => {
            if (this.moving.up) this.move(-CONST.PLAYER_MOV_SPD);
            if (this.moving.down) this.move(CONST.PLAYER_MOV_SPD);
        }, interval);
    }

    // Public methods to access private attributes
    public getId() {
        return this.id;
    }

    public getSocket() {
        return this.socket;
    }

    public setMoveUp(up: boolean) {
        this.moving.up = up;
    }

    public setMoveDown(down: boolean) {
        this.moving.down = down;
    }

    public resizePaddle(top: number, bot: number) {
        this.paddle = { top: top, bot: bot };
    }

    public resizeZone(top: number, bot: number) {
        this.zone = { top: top, bot: bot };
    }

    // Ready state methods
    public setReadyState(isReady: boolean) {
        this.ready = isReady;
    }

    public toggleReadyState() {
        this.ready = !this.ready;
    }

    public isReady() {
        return this.ready;
    }

    public getPaddle(): Range {
        return this.paddle;
    }

    public getZone(): Range {
        return this.zone;
    }

    private move(distance: number) {
        this.paddle.top += distance;
        this.paddle.bot += distance;

        // Ensure being in the appropriate zone
        if (this.paddle.top < this.zone.top) {
            this.paddle.bot += this.zone.top - this.paddle.top;
            this.paddle.top = this.zone.top;
        }
        if (this.paddle.bot > this.zone.bot) {
            this.paddle.top += this.zone.bot - this.paddle.bot;
            this.paddle.bot = this.zone.bot;
        }
    }
}
