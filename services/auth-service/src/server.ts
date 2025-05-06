import 'reflect-metadata';
import path from 'path';
import dotenv from 'dotenv';
import fastify from 'fastify';
import { AppDataSource } from './data-source';
import { loginSingUp } from './routes/user.routes';
import { authentication } from './routes/auth.routes';

dotenv.config({ path: path.resolve(__dirname, '../../.env')});

const app = fastify();

AppDataSource.initialize()
.then(async() => {
	console.log("auth service connected to db connected");
	await app.register(loginSingUp);
	await app.register(authentication);

	app.listen({ port: 3002}, () => {
		console.log('auth service running on http://localhost:3002');
	});
})
.catch((err) => {
	console.error('Error during db init: ', err);
})