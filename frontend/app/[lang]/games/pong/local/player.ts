import type { Range } from '@/types/types' ;
import * as CONST from './constants' ;


export class Player {
	private paddle: Range

	constructor() {
		this.paddle = {
			top: (CONST.BOARD_HEIGHT / 2) - (CONST.PADDLE_SIZE / 2),
			bot: (CONST.BOARD_HEIGHT / 2) + (CONST.PADDLE_SIZE / 2)
		}
	}


	get_paddle() { return this.paddle ; }

	move(up: boolean) { // true moving up, false moving down
		if (up) {
			this.paddle.top -= CONST.PLAYER_MOV_SPD ;
			this.paddle.bot -= CONST.PLAYER_MOV_SPD ;
		} else {
			this.paddle.top += CONST.PLAYER_MOV_SPD ;
			this.paddle.bot += CONST.PLAYER_MOV_SPD ;
		}

		// Ensure being in the appropriate zone
		if (this.paddle.top < 0) {
			this.paddle.bot -= this.paddle.top ;
			this.paddle.top = 0 ;
		}
		if (this.paddle.bot > CONST.BOARD_HEIGHT) {
			this.paddle.top += CONST.BOARD_HEIGHT - this.paddle.bot ;
			this.paddle.bot = CONST.BOARD_HEIGHT ;
		}
	}
}
