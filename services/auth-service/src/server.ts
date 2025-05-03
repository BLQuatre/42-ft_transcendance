import 'reflect-metadata';
import path from 'path';
import dotenv from 'dotenv';
import fastify from 'fastify';
import { AppDataSource } from './data-source';
import { loginSingUp } from './routes/user.routes';

dotenv.config({ path: path.resolve(__dirname, '../../.env')});

const app = fastify();

AppDataSource.initialize()
.then(async() => {
	console.log("User db auth connected");
	await app.register(loginSingUp);

	app.listen({ port: 3002}, () => {
		console.log('auth service running on http://localhost:3002');
	});
})
.catch((err) => {
	console.error('Error during db init: ', err);
})