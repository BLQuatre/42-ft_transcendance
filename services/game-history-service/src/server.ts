import 'reflect-metadata';
import path from "path";
import dotenv from 'dotenv';
import fastify from "fastify";
import { AppDataSource } from "./data-source";
import { gameHistoryRoutes } from './routes/gameHistory.routes';

dotenv.config({ path: path.resolve(__dirname, '../../../.env.dev') });

const app = fastify({
	logger: process.env.DEBUG === 'true',
});

AppDataSource.initialize()
.then(async () => {
	app.log.info("[GAME HISTORY] Connected to database");

	app.register(gameHistoryRoutes);

	app.listen({
		host: process.env.GAMEH_HOST,
		port: parseInt(process.env.GAMEH_PORT || "0", 10)
	}, (err, address) => {
		if (err) {
			app.log.error(err);
			process.exit(1);
		}
		app.log.info(`[GAME HISTORY] Running on http://${process.env.GAMEH_HOST}:${process.env.GAMEH_PORT} (${address})`);
	});
})
.catch((err) => {
	console.log(err);
	app.log.error('[GAME HISTORY] Error during database init:', err);
});
