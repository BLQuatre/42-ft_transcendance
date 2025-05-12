import 'reflect-metadata';
import path from "path";
import dotenv from 'dotenv';
import fastify from "fastify";
import { AppDataSource } from "./data-source";
import { userRoutes } from './routes/user.routes';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const app = fastify({
	logger: process.env.DEBUG === 'true',
});

AppDataSource.initialize()
.then(async () => {
	// AppDataSource.synchronize(true);
	app.log.info("[USER] Connected to database");
	// await AppDataSource.synchronize();
	// await AppDataSource.dropDatabase();
	// await AppDataSource.synchronize();
	await app.register(userRoutes);

	app.listen({
		host: process.env.USER_HOST,
		port: parseInt(process.env.USER_PORT || "0", 10)
	}, (err, address) => {
		if (err) {
			app.log.error(err);
			process.exit(1);
		}
		app.log.info(`[FRIEND] Running on http://${process.env.USER_HOST}:${process.env.USER_PORT} (${address})`);
	});
})
.catch((err) => {
	app.log.error('[USER] Error during database init:', err);
});
