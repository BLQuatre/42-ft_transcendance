import fastify from "fastify";
import websocket from '@fastify/websocket';
import WebSocket from 'ws';
import usersRoutes from './routes/users';
import postsRoutes from './routes/posts';

const app = fastify();

app.register(usersRoutes);
app.register(postsRoutes);
app.register(websocket);

app.register(async function (app) {
	app.get('/ws', { websocket: true}, (connection, req) => {
		const upstream = new WebSocket('http://localhost:3003/ws');

		upstream.on('open', () => {
			console.log('Connexion au microservice réussi');
		});

		upstream.on('error', (err) => {
			console.error('Error on connection at microservice');
		});

		connection.on('message', (msg : any) => {
			upstream.readyState === 1 && upstream.send(msg);
		});

		upstream.on('message', (msg : any) => {
			connection.send(msg.toString());
		});

		upstream.on('close', () => connection.close());
		connection.on('close', () => upstream.close());
	});
})



app.listen({ port: 3000 }, (err, address) => {
	if (err) throw err;
	console.log(`Gateway is listening at ${address}`);
})