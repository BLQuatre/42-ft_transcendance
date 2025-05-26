import { FastifyPluginAsync } from "fastify";
import WebSocket from "ws";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../.env.dev") });

interface MessageSocket {
	type: string;
	receiverId: string;
	content: string;
}

interface SchemaId {
	user_id: string;
}

export const chatRoutes: FastifyPluginAsync = async (fastify) => {
	fastify.get(
		"/ws/chat-friend",
		{ websocket: true },
		async (connection, req) => {
			const { user_id } = req.query as SchemaId;

			const upstream = new WebSocket(
				`http://${process.env.CHAT_HOST}:${process.env.CHAT_PORT}/chat/ws?user_id=${user_id}`
			);

			upstream.on("open", () => {
				console.log("[CHAT] Connected to chat microservice");
			});

			upstream.on("error", (err) => {
				console.error("[CHAT] Error connecting to chat microservice:", err);
			});

			connection.on("message", (msg: any) => {
				console.log(`[CHAT] received msg: ${msg.toString()}`);
				try {
					const parsed: MessageSocket = JSON.parse(msg.toString());
					upstream.readyState === 1 && upstream.send(JSON.stringify(parsed));
				} catch (err) {
					console.error("[CHAT] Invalid message format", err);
					connection.send(JSON.stringify({ error: "Invalid message format" }));
				}
			});

			upstream.on("message", (msg: string) => {
				console.log(`[CHAT] return msg: ${msg}`);
				connection.send(msg.toString());
			});

			upstream.on("close", (code, reason) => {
				const message = `[CHAT] Microservice closed. Code: ${code}, Reason: ${reason.toString()}`;
				connection.send(message);
				connection.close();
			});
			connection.on("close", (code, reason) => {
				upstream.close();
			});
		}
	);
};
