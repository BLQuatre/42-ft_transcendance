import Fastify from 'fastify' ;
import { WebSocketServer } from 'ws' ;

import { Game } from './game' ;
import { Player } from './player';
import * as CONST from './constants' ;

const fastify = Fastify() ;

let gameInterval: NodeJS.Timeout | null = null ;

let game = new Game() ;
let id = 0 ;

fastify.get('/', async (request, reply) => {
	return { status: 'Pong server is running' };
});

const start = async () => {
	await fastify.listen({ port: 3001 }).catch(console.error) ;

	console.log('Server running on http://localhost:3001') ;

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
		ws.send(JSON.stringify({ type: 'assign', playerId: assignedPlayer.get_id() })) ;

		// Start game when 2 players are here
		if (game.getNumberPlayer() === 2)
			startGame() ;

		ws.on('message', (message) => {
			const data = JSON.parse(message.toString()) ;

			if (data.type === 'jump' && data.playerId)
				game.getPlayerById(data.playerId)?.jump() ;
			if (data.type === 'fall' && data.playerId)
				game.getPlayerById(data.playerId)?.fall() ;
		}) ;

		ws.on('close', () => {
			console.log('Client disconnected') ;

			if (assignedPlayer)
				assignedPlayer.socket = undefined ;
			
			stopGame() ;
		}) ;
	}) ;
} ;

function startGame() {
	if (gameInterval)
		return ;

	console.log('Game started') ;
	gameInterval = setInterval(() => {
		broadcastGame() ;
	}, 1000 / CONST.FPS) ;
}

// TODO: change the paused state
function stopGame() {
	if (gameInterval) {
		console.log('Game paused') ;
		clearInterval(gameInterval) ;
		gameInterval = null ;
	}
}

function broadcastGame() {
	const state = {
		type: 'state',
		gameState: game.getState()
	} ;

	const data = JSON.stringify(state) ;

	game.dinos.forEach(dino => {
		const socket = dino.player.socket ;
		if (socket && socket.readyState === socket.OPEN) {
			socket.send(data) ;
		}
	}) ;
}

start().catch(err => {
	console.error('Failed to start server:', err);
	process.exit(1);
}) ;
