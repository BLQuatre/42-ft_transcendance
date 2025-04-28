import fastify from "fastify";
import fastifyWebsocket from "@fastify/websocket";
// import { Server , IncomingMessage, ServerResponse } from 'http';
// import { Socket } from "net";

const app = fastify({
	logger : true
});

app.register(fastifyWebsocket);

app.get('/', async (request, reply) => {
	return {message: 'this fastify websocket work correctly!'};
});

app.register(async function (app) {
	app.get('/ws', { websocket: true }, (connection, req) => {
		connection.socket.on('message', (message: Buffer) => {
			const textMessage = message.toString();
			console.log(`Mesage get: ${textMessage}`);

			connection.socket.send(`Server get: ${textMessage}`);
		});

		connection.socket.on('close', () => {
			console.log('Client disconnected');
		});
		
		connection.socket.send('Connected to websocket');
	});
});
  
const PORT = process.env.PORT || 3003;

const start = async () => {
	try {
		await app.listen({ port: PORT as number, host: '0.0.0.0' });
		console.log(`Server started on port ${PORT}`);
	} catch (err) {
		app.log.error(err);
		process.exit(1);
	}
}

start();
