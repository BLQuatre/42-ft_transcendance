import { FastifyPluginAsync } from "fastify";
import { ChatService } from "../services/chatGeneral.service";

const chatGeneralRoutes: FastifyPluginAsync = async (fastify, opts) => {
	const chatService = new ChatService();

	fastify.get("/messages", async (request, reply) => {
		const { limit = 50 } = request.query as { limit: number };
		return await chatService.getMessages(limit);
	});

	fastify.post("/messages", async (request, reply) => {
		const { content, userId, name } = request.body as {
			content: string;
			userId: string;
			name: string;
		};
		return await chatService.saveMessage(content, userId, name);
	});
};

export default chatGeneralRoutes;
