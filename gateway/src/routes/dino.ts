import { FastifyPluginAsync } from "fastify";
import WebSocket from "ws";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../.en.dev") });

interface messageSocket {
	type: string; // join_room | toggle_ready | jump | up | down
	roomId: string; // uuid ? int
	playerId: string; // uuid
}

interface SchemaId {
	playerId: string;
}

export const dinoRoutes: FastifyPluginAsync = async (fastify) => {
	fastify.get("/ws/dino", { websocket: true }, async (connection, req) => {
		const upstream = new WebSocket(
			`http://${process.env.DINO_HOST}:${process.env.DINO_PORT}`
		);
		const messageQueue: string[] = [];

		let isUpstreamOpen = false;

		upstream.on("open", () => {
			console.log("Connexion au microservice resussi");
			isUpstreamOpen = true;

			// Flush the message queue
			for (const msg of messageQueue) {
				upstream.send(msg);
			}
			messageQueue.length = 0;
		});

		upstream.on("error", (err) => {
			console.error("Error on connection at microservice", err);
		});

		connection.on("message", (msg: any) => {
			try {
				console.log(`send message : ${msg}`);
				const parsed: messageSocket = JSON.parse(msg.toString());
				const serialized = JSON.stringify(parsed);

				console.log(
					`isUpstreamOpen = ${isUpstreamOpen ? "true" : "false"} / (upstream.readyState === 1) = ${upstream.readyState === 1 ? "true" : "false"}`
				);
				if (isUpstreamOpen && upstream.readyState === 1) {
					upstream.send(serialized);
				} else {
					messageQueue.push(serialized);
				}
			} catch (err) {
				console.error("Invalid message format", err);
				connection.send(JSON.stringify({ error: "Invalid message format" }));
			}
		});

		upstream.on("message", (msg: string) => {
			console.log(`return msg: ${msg}`);
			connection.send(msg.toString());
		});

		upstream.on("close", (code, reason) => {
			const message = `Dino closed. Code: ${code}, Reason: ${reason}`;
			connection.send(message);
			connection.close();
		});

		connection.on("close", (code, reason) => {
			upstream.close();
		});
	});
};
