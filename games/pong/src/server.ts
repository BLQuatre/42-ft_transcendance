import Fastify from 'fastify';
import { WebSocketServer, WebSocket } from 'ws';

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

import http from 'http';

const fastify = Fastify();
const server = http.createServer(fastify.server as any);
const wss = new WebSocketServer({ server });

const connections: { socket: WebSocket, playerId: number }[] = [];

fastify.get('/', async (request, reply) => {
	return { pong: 'it works' };
});

function assignPlayerId(): number {
	const connectedIds = connections.map(c => c.playerId);
	if (!connectedIds.includes(1)) return 1;
	if (!connectedIds.includes(2)) return 2;
	return -1; // Game full
}

wss.on('connection', (ws) => {
	const playerId = assignPlayerId();

	if (playerId === -1) {
		ws.send(JSON.stringify({ type: 'error', message: 'Game is full' }));
		ws.close();
		return;
	}

	console.log(`Player ${playerId} connected`);
	connections.push({ socket: ws, playerId });

	// Inform client which player they are
	ws.send(JSON.stringify({ type: 'assign', playerId }));

	ws.on('message', (message) => {
		const data = JSON.parse(message.toString());

		if (data.type === 'move') {
			const player = gameState.players.find(p => p.id === data.playerId);
			if (player) {
				if (data.direction === 'up') player.y -= 10;
				if (data.direction === 'down') player.y += 10;
				if (player.y < 0) player.y = 0;
				if (player.y > 600) player.y = 600;
			}
		}
	});

	ws.on('close', () => {
		console.log(`Player ${playerId} disconnected`);
		const index = connections.findIndex(c => c.socket === ws);
		if (index > -1) connections.splice(index, 1);
	});
});

setInterval(() => {
	updateGame();
	broadcastGame();
}, 1000 / 60);

function updateGame() {
	gameState.ball.x += gameState.ball.vx;
	gameState.ball.y += gameState.ball.vy;

	if (gameState.ball.y <= 0 || gameState.ball.y >= 600) {
		gameState.ball.vy *= -1;
	}

	gameState.players.forEach(player => {
		if (player.id === 1 && gameState.ball.x <= 30) {
			if (Math.abs(gameState.ball.y - player.y) < 50 && gameState.ball.vx < 0) {
				gameState.ball.vx *= -1;
			}
		}
		if (player.id === 2 && gameState.ball.x >= 770) {
			if (Math.abs(gameState.ball.y - player.y) < 50 && gameState.ball.vx > 0) {
				gameState.ball.vx *= -1;
			}
		}
	});

	if (gameState.ball.x < 0) {
		gameState.players[1].score += 1;
		resetBall();
	}
	if (gameState.ball.x > 800) {
		gameState.players[0].score += 1;
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
	const state = JSON.stringify({ type: 'state', gameState });
	connections.forEach(({ socket }) => {
		if (socket.readyState === WebSocket.OPEN) {
			socket.send(state);
		}
	});
}

server.listen(3000, () => {
	console.log('Server running on http://localhost:3000');
});
