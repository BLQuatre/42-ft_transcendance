import Fastify from 'fastify';
import { WebSocketServer, WebSocket } from 'ws'; // <-- Correct

const fastify = Fastify();
const connections: WebSocket[] = []; // <-- Correct type

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
			console.log('Received message:', message.toString());
		});

		ws.on('close', () => {
			console.log('Client disconnected');
			const index = connections.indexOf(ws);
			if (index > -1) connections.splice(index, 1);
		});
	});

	setInterval(() => {
		const gameState = { ball: { x: 0, y: 0 }, paddles: [] }; // example
		const state = JSON.stringify(gameState);
		connections.forEach(ws => {
			if (ws.readyState === ws.OPEN) {
				ws.send(state);
			}
		});
	}, 1000 / 60);
};

start();
