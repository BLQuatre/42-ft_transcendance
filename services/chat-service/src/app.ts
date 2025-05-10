import fastify from "fastify";
import fastifyWebsocket from "@fastify/websocket";
import { chatRoutes } from "./routes/chat.routes";
import typeormPlugin from "./plugins/typeorm.plugin";

export async function buildApp() {
	const app =  fastify({ logger: true})

	await app.register(fastifyWebsocket);

	await app.register(typeormPlugin);

	await app.register(chatRoutes, { prefix: '/chat'});

	return app;
}