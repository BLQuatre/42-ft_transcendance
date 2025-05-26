import fastify from "fastify";
import wsFastify from "./plugins/websocket";
import chatGeneralRoutes from "./routes/chatGeneral.routes";
import typeormPlugin from "./plugins/typeorm.plugin";

export async function buildApp() {
	const app = fastify({ logger: true });

	await app.register(typeormPlugin);
	await app.register(wsFastify);

	await app.register(chatGeneralRoutes, { prefix: "/api/chat " });

	return app;
}
