import fastify from "fastify";
import websocket from '@fastify/websocket';
import WebSocket from 'ws';
import { usersRoutes } from './routes/users';
import authRoutes from "./routes/auth";
import { friendRoutes } from "./routes/friend";
import dotenv from 'dotenv';
import path from 'path';
import { chatRoutes } from "./routes/chat";

dotenv.config({ path: path.resolve(__dirname, '../../../.env')});

const app = fastify({
	logger: process.env.DEBUG === 'true',
});

// app.register(userRoutes);
app.register(websocket);
app.register(authRoutes);
app.register(usersRoutes);
app.register(friendRoutes);
app.register(chatRoutes);

// app.register(async function (app) {
// 	app.get('/ws', { websocket: true}, (connection, req) => {
// 		const upstream = new WebSocket('http://0.0.0.0:3003/ws');

// 		upstream.on('open', () => {
// 			console.log('Connexion au microservice réussi');
// 		});

// 		upstream.on('error', (err) => {
// 			console.error('Error on connection at microservice');
// 		});

// 		connection.on('message', (msg : any) => {
// 			upstream.readyState === 1 && upstream.send(msg);
// 		});

// 		upstream.on('message', (msg : any) => {
// 			connection.send(msg.toString());
// 		});

// 		upstream.on('close', () => connection.close());
// 		connection.on('close', () => upstream.close());
// 	});
// })

// app.get('/ping', async (request, reply) => {
// 	return 'pong\n'
// })

app.listen({
	host: process.env.GATEWAY_HOST,
	port: parseInt(process.env.GATEWAY_PORT || '0', 10)
}, (err, address) => {
	if (err) throw err;
	app.log.info(`[GATEWAY] Running on http://${process.env.GATEWAY_HOST}:${process.env.GATEWAY_PORT} (${address})`);
})
