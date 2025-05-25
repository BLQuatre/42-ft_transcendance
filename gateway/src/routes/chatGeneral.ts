import { FastifyPluginAsync } from "fastify";
import WebSocket from "ws";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env.dev')});

interface messageSocket {
	type: string;
	userId: string,
	content: string,
	name: string
}

export const chatGeneralRoutes: FastifyPluginAsync = async (fastify) => {
	fastify.get('/ws/chat-general', { websocket: true}, async (connection, req) => {

		const upstream = new WebSocket(`http://${process.env.CHATG_HOST}:${process.env.CHATG_PORT}/ws/chat`);

		upstream.on('open', () => {
			console.log("Connexion au microservice reussi");
		});

		upstream.on('error', (err) => {
			console.error('Error on connection at microservice');
		});

		connection.on('message', (msg: any) => {
			try {
				const parsed: messageSocket = JSON.parse(msg.toString());
				upstream.readyState === 1 && upstream.send(JSON.stringify(parsed));
			} catch (err) {
				console.error("Invalid message format", err);
				connection.send(JSON.stringify({ error: "Invalid message format" }));
			}
		});

		upstream.on('message', (msg: string) => {
			console.log(`return msg: ${msg}`);
			connection.send(msg.toString());
		});

		upstream.on('close', (code, reason) => {
			const message = `Micro-service fermé. Code: ${code}, Raison: ${reason.toString()}`;
			connection.send(message);
			connection.close();
		})

		connection.on('close', (code, reason) => {
			upstream.close()
		});
	});
}
