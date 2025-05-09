import 'reflect-metadata';
import fastify from "fastify";
import path from "path";
import dotenv from 'dotenv';
import { AppDataSource } from './data-source';
import { friendRoutes } from './routes/friend.routes';

dotenv.config({ path: path.resolve(__dirname, '../../../.env')});

const app = fastify();

AppDataSource.initialize()
.then(async () => {
	console.log("Friend service db connected");

	await app.register(friendRoutes);
	
	app.listen({ port: 3003, host: '0.0.0.0'}, () => {
		console.log(`Friend service running on http://localhost:3003`);
	});
})
.catch((err) => {
	console.error('Error during db init: ', err);
})