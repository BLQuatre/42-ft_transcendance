import fastify from "fastify";
import fastifyWebsocket from "@fastify/websocket";
import { chatRoutes } from "./routes/chat.routes";
import typeormPlugin from "./plugins/typeorm.plugin";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../.env.dev") });

export async function buildApp() {
	const app = fastify({
		logger: process.env.DEBUG === "true",
	});

	await app.register(fastifyWebsocket);
	await app.register(typeormPlugin);
	await app.register(chatRoutes, { prefix: "/chat" });

	return app;
}
