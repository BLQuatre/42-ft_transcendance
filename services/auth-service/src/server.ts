import 'reflect-metadata';
import path from 'path';
import dotenv from 'dotenv';
import fastify from 'fastify';
import { AppDataSource } from './data-source';
import { loginSingUp } from './routes/user.routes';
import { authentication } from './routes/auth.routes';

dotenv.config({ path: path.resolve(__dirname, '../../../.env')});

const app = fastify({
	logger: process.env.DEBUG === 'true',
});

AppDataSource.initialize()
.then(async() => {
	app.log.info('[AUTH] Connected to database');
	await app.register(loginSingUp);
	await app.register(authentication);

	app.listen({
		host: process.env.AUTH_HOST,
		port: parseInt(process.env.AUTH_PORT || '0', 10)
	}, (err, address) => {
		if (err) {
			app.log.error(err);
			process.exit(1);
		}
		app.log.info(`[AUTH] Running on http://${process.env.AUTH_HOST}:${process.env.AUTH_PORT} (${address})`);
	})
})
.catch((err) => {
	app.log.error('[AUTH] Error during database init', err);
})
