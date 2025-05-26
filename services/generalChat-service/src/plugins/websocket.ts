import websocket from "@fastify/websocket";
import fastify, { FastifyPluginAsync } from "fastify";
import { ChatService } from "../services/chatGeneral.service";

const wsFastify: FastifyPluginAsync = async (fastify, opts) => {
	await fastify.register(websocket);

	const chatService = new ChatService();

	fastify.get("/ws/chat", { websocket: true }, (connection, req) => {
		connection.on("message", async (message) => {
			try {
				const data = JSON.parse(message.toString());

				if (data.type === "message") {
					const savedMessage = await chatService.saveMessage(
						data.content,
						data.userId,
						data.name
					);

					fastify.websocketServer.clients.forEach((client) => {
						if (client.readyState === client.OPEN) {
							client.send(
								JSON.stringify({
									type: "message",
									message: savedMessage,
								})
							);
						}
					});
				} else if (data.type === "history") {
					const messages = await chatService.getMessages();
					connection.send(
						JSON.stringify({
							type: "history",
							messages,
						})
					);
				}
			} catch (err) {
				console.error("Error handling WebSocket message: ", err);
			}
		});
	});
};

export default wsFastify;
