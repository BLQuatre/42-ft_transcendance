import { FastifyInstance } from "fastify";
import { ChatController } from "../controller/chat.controller";

const chatController = new ChatController();

export async function chatRoutes(fastify: FastifyInstance) {
	fastify.get("/ws", { websocket: true }, (connection, request) => {
		chatController.handleConnection(connection, request);
	});
}
