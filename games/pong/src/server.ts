import Fastify from 'fastify' ;
import { WebSocketServer } from 'ws' ;

import { Game } from './game' ;
import { Player } from './player' ;
import * as CONST from './constants' ;


const fastify = Fastify() ;

let game = new Game() ;
let id = 0 ;


const start = async () => {
	await fastify.listen({ port: 3002 }) ;
	console.log('Server running on http://localhost:3002') ;

	const wss = new WebSocketServer({ server: fastify.server }) ;

	wss.on('connection', (ws) => {
		console.log('Client connected') ;

		let assignedPlayer: Player ;
		
		if (game.getNumberPlayer() < 8) {
			assignedPlayer = new Player(++id, ws) ;
			game.addPlayer(assignedPlayer) ;
		} else {
			ws.close() ; // refuse extra connections
			return ;
		}

		// Tell client its player ID
		ws.send(JSON.stringify({ type: 'assign', playerId: assignedPlayer.id })) ;

		// Start game when 2 players are here
		if (game.getNumberPlayer() === 2)
			startGame() ;

		ws.on('message', (message) => {
			const data = JSON.parse(message.toString()) ;

			// TODO: prevent players from moving before the game start
			if (data.type === 'move' && data.playerId && data.direction) {
				const player = game.getPlayerById(data.playerId) ;
				if (player === undefined)
					return ;
			
				if		(data.direction === 'up')		player.setMoveUp(true) ;
				else if	(data.direction === 'notup')	player.setMoveUp(false) ;
				else if	(data.direction === 'down')		player.setMoveDown(true) ;
				else if	(data.direction === 'notdown')	player.setMoveDown(false) ;
			}			
		}) ;

		ws.on('close', () => {
			console.log('Client disconnected') ;

			if (assignedPlayer)
				assignedPlayer.socket = undefined ;
			
			stopGame() ;
		}) ;
	}) ;
} ;

let servIntervalID: NodeJS.Timeout | null = null ; // Temporary ig

function startGame() {
	console.log('Game started') ;

	game.startUpdating() ;

	const interval = 1000 / CONST.FPS ;
	servIntervalID = setInterval(() => broadcastGame(), interval) ;
}

// TODO: change the paused state
function stopGame() {
	game.stopUpdating() ;
	if (servIntervalID) {
		console.log('Game paused') ;
		clearInterval(servIntervalID) ;
		servIntervalID = null ;
	}
}

function broadcastGame() {
	const state = {
		type: 'state',
		gameState: game.getState()
	} ;

	const data = JSON.stringify(state) ;

	[ ... game.left_team.players, ... game.right_team.players].forEach(player => {
		if (player.socket && player.socket.readyState === player.socket.OPEN) {
			player.socket.send(data) ;
		}
	}) ;
}

start() ;
