interface Player {
	id: number;
	y: number;
	score: number;
}

interface Ball {
	x: number;
	y: number;
	vx: number;
	vy: number;
}

interface GameState {
	players: Player[];
	ball: Ball;
}

let gameState: GameState = {
	players: [
		{ id: 1, y: 250, score: 0 },
		{ id: 2, y: 250, score: 0 }
	],
	ball: {
		x: 400,
		y: 300,
		vx: 5,
		vy: 5
	}
};


import Fastify from 'fastify';
import { WebSocketServer, WebSocket } from 'ws';

const fastify = Fastify();
const connections: WebSocket[] = [];

fastify.get('/', async (request, reply) => {
	return { pong: 'it works' };
});

const start = async () => {
	await fastify.listen({ port: 3000 });
	console.log('Server running on http://localhost:3000');

	const wss = new WebSocketServer({ server: fastify.server });

	wss.on('connection', (ws) => {
		console.log('Client connected');
		connections.push(ws);
		
		ws.on('message', (message) => {
			const data = JSON.parse(message.toString());
		
			if (data.playerId && data.direction) {
				const player = gameState.players.find(p => p.id === data.playerId);
				if (player) {
					if (data.direction === 'up') {
						player.y -= 10;
					}
					if (data.direction === 'down') {
						player.y += 10;
					}

					if (player.y < 0) player.y = 0;
					if (player.y > 600) player.y = 600;
				}
			}
		});

		ws.on('close', () => {
			console.log('Client disconnected');
			const index = connections.indexOf(ws);
			if (index > -1) connections.splice(index, 1);
		});
	});

	setInterval(() => {
		updateGame();
		broadcastGame();
	}, 1000 / 60);
};

function updateGame() {
	// Move ball
	gameState.ball.x += gameState.ball.vx;
	gameState.ball.y += gameState.ball.vy;
	
	// Collide top/bottom
	if (gameState.ball.y <= 0 || gameState.ball.y >= 600) { // assuming field height = 600
		gameState.ball.vy *= -1;
	}
	
	// Collide paddles (very simple version)
	gameState.players.forEach(player => {
		if (player.id === 1 && gameState.ball.x <= 30) { // left paddle
			if (Math.abs(gameState.ball.y - player.y) < 50 && gameState.ball.vx < 0) { // paddle size = 100
				gameState.ball.vx *= -1;
			}
		}
		if (player.id === 2 && gameState.ball.x >= 770) { // right paddle (field width 800)
			if (Math.abs(gameState.ball.y - player.y) < 50 && gameState.ball.vx > 0) {
				gameState.ball.vx *= -1;
			}
		}
	});
	
	// Score
	if (gameState.ball.x < 0) {
		gameState.players[1].score += 1; // player 2 scores
		resetBall();
	}
	if (gameState.ball.x > 800) {
		gameState.players[0].score += 1; // player 1 scores
		resetBall();
	}
}

function resetBall() {
	gameState.ball.x = 400;
	gameState.ball.y = 300;
	gameState.ball.vx = 5 * (Math.random() > 0.5 ? 1 : -1);
	gameState.ball.vy = 5 * (Math.random() > 0.5 ? 1 : -1);
}

function broadcastGame() {
	const state = JSON.stringify(gameState);
	connections.forEach(ws => {
		if (ws.readyState === ws.OPEN) {
			ws.send(state);
		}
	});
}

start();
