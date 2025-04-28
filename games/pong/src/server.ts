import Fastify from 'fastify';
import fastifyWebsocket from '@fastify/websocket';
import { Game } from './game';

const fastify = Fastify();
fastify.register(fastifyWebsocket);

const connections: any[] = [];
const game = new Game();

// Handle WebSocket connection
fastify.get('/ws', { websocket: true }, (connection, req) => {
	console.log('Client connected');

	connections.push(connection);

	connection.socket.on('message', (message: Buffer) => {
		const input = JSON.parse(message.toString());
		handleInput(input, connection);
	});

	connection.socket.on('close', () => {
		console.log('Client disconnected');
		const index = connections.indexOf(connection);
		if (index > -1) connections.splice(index, 1);
	});
});

// Move paddle based on client input
function handleInput(input: any, connection: any) {
	const { action, direction, player } = input;
	if (action === 'move') {
		const paddle = player === 1 ? game.state.paddle1 : game.state.paddle2; // FIXME: this is implying 2 player only
		if (direction === 'up') paddle.y -= 5;
		if (direction === 'down') paddle.y += 5;
	}
}

// Game loop
setInterval(() => {
	game.update();
	const state = JSON.stringify(game.state);
	connections.forEach(conn => conn.socket.send(state));
}, 1000 / 60);

fastify.listen({ port: 3000 }, () => {
	console.log('Server running on http://localhost:3000');
});
