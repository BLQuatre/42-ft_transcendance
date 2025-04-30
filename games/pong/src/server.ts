import Fastify from 'fastify';
import { WebSocketServer, WebSocket } from 'ws';

interface Player {
	id: number;
	y: number;
	score: number;
	socket: WebSocket | null;
}

interface Ball {
	x: number;
	y: number;
	vx: number;
	vy: number;
}

interface GameState {
	players: Omit<Player, 'socket'>[];
	ball: Ball;
}

const fastify = Fastify();

let player1: Player = { id: 1, y: 250, score: 0, socket: null };
let player2: Player = { id: 2, y: 250, score: 0, socket: null };

let ball: Ball = {
	x: 400,
	y: 300,
	vx: 5,
	vy: 5
};

let gameInterval: NodeJS.Timeout | null = null;

const getGameState = (): GameState => ({
	players: [
		{ id: 1, y: player1.y, score: player1.score },
		{ id: 2, y: player2.y, score: player2.score }
	],
	ball
});

fastify.get('/', async (request, reply) => {
	return { pong: 'it works' };
});

const start = async () => {
	await fastify.listen({ port: 3000 });
	console.log('Server running on http://localhost:3000');

	const wss = new WebSocketServer({ server: fastify.server });

	wss.on('connection', (ws) => {
		console.log('Client connected');

		let assignedPlayer: Player | null = null;

		// Assign player slot
		if (!player1.socket) {
			player1.socket = ws;
			assignedPlayer = player1;
		} else if (!player2.socket) {
			player2.socket = ws;
			assignedPlayer = player2;
		} else {
			ws.close(); // refuse extra connections
			return;
		}

		// Tell client its player ID
		ws.send(JSON.stringify({ type: 'assign', playerId: assignedPlayer.id }));

		if (player1.socket && player2.socket) {
			startGame();
		}

		ws.on('message', (message) => {
			const data = JSON.parse(message.toString());

			if (data.type === 'move' && data.playerId && data.direction) {
				const player = data.playerId === 1 ? player1 : player2;
			
				const moveSpeed = 6; // Tune this value for faster/slower movement
			
				if (data.direction === 'up') player.y -= moveSpeed;
				if (data.direction === 'down') player.y += moveSpeed;
			
				// Clamp position to stay within canvas
				player.y = Math.max(0, Math.min(600, player.y));
			}			
		});

		ws.on('close', () => {
			console.log('Client disconnected');

			if (assignedPlayer) assignedPlayer.socket = null;

			stopGame();
		});
	});
};

function startGame() {
	if (gameInterval) return;

	console.log('Game started');
	gameInterval = setInterval(() => {
		updateGame();
		broadcastGame();
	}, 1000 / 60);
}

function stopGame() {
	if (gameInterval) {
		console.log('Game paused');
		clearInterval(gameInterval);
		gameInterval = null;
	}
}

function updateGame() {
	// Move ball
	ball.x += ball.vx;
	ball.y += ball.vy;

	if (ball.y <= 0 || ball.y >= 600) {
		ball.vy *= -1;
	}

	// Paddle collision
	[player1, player2].forEach(player => {
		// Check for collision
		if ((player.id === 1 && ball.x <= 40 && ball.vx < 0) || (player.id === 2 && ball.x >= 760 && ball.vx > 0)) {
			// Check if the ball is within the paddle's vertical range
			if (Math.abs(ball.y - player.y) < 50) {
				const paddleCenter = player.y;
				const distanceFromCenter = ball.y - paddleCenter;
				const normalizedOffset = distanceFromCenter / 50; // Between -1 and 1
				const angleInfluence = 5; // Adjust how much paddle hit influences direction
				
				// 1. Determine new direction
				const angle = normalizedOffset * (Math.PI / 4); // max ±45°
				const direction = ball.vx > 0 ? Math.PI - angle : angle; // Reflect X
				
				// 2. Increase total speed
				let speed = Math.sqrt(ball.vx ** 2 + ball.vy ** 2);
				speed *= 1.05; // slightly faster on each paddle hit
				
				// 3. Set new velocity vector with same speed, new angle
				ball.vx = Math.cos(direction) * speed;
				ball.vy = Math.sin(direction) * speed;
			}
		}
	});

	// Scoring
	if (ball.x < 0) {
		player2.score += 1;
		resetBall();
	}
	if (ball.x > 800) {
		player1.score += 1;
		resetBall();
	}
}

function resetBall() {
	const speed = 7; // you can tweak this
	let angle: number;

	// Avoid angles too close to horizontal or vertical (e.g., 0°, 90°, 180°, 270°)
	do {
		angle = Math.random() * 2 * Math.PI;
	} while (
		Math.abs(Math.cos(angle)) < 0.3 || // too vertical
		Math.abs(Math.sin(angle)) < 0.3    // too horizontal
	);

	ball.x = 400;
	ball.y = 300;
	ball.vx = Math.cos(angle) * speed;
	ball.vy = Math.sin(angle) * speed;
}

function broadcastGame() {
	const state = {
		type: 'state',
		gameState: getGameState()
	};

	const data = JSON.stringify(state);

	[player1, player2].forEach(player => {
		if (player.socket && player.socket.readyState === player.socket.OPEN) {
			player.socket.send(data);
		}
	});
}

start();
