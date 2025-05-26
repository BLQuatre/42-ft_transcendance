import "reflect-metadata";
import fastify from "fastify";
import path from "path";
import dotenv from "dotenv";
import { AppDataSource } from "./data-source";
import { friendRoutes } from "./routes/friend.routes";

dotenv.config({ path: path.resolve(__dirname, "../../../.env.dev") });

const app = fastify({
	logger: process.env.DEBUG === "true",
});

AppDataSource.initialize()
	.then(async () => {
		app.log.info("[FRIEND] Connected to database");

		await app.register(friendRoutes);

		app.listen(
			{
				host: process.env.FRIEND_HOST,
				port: parseInt(process.env.FRIEND_PORT || "0", 10),
			},
			(err, address) => {
				if (err) {
					app.log.error(err);
					process.exit(1);
				}
				app.log.info(
					`[FRIEND] Running on http://${process.env.FRIEND_HOST}:${process.env.FRIEND_PORT} (${address})`
				);
			}
		);
	})
	.catch((err) => {
		app.log.error("[FRIEND] Error during database init:", err);
	});
