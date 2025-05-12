import { buildApp } from "./app";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env')});

const start = async () => {
	const app = await buildApp();

	try {
		await app.listen({
			host: process.env.CHAT_HOST,
			port: parseInt(process.env.CHAT_PORT || "0", 10)
		});
		app.log.info(`[CHAT] Running on http://${process.env.CHAT_HOST}:${process.env.CHAT_PORT}`);
	} catch (err) {
		app.log.error(err);
		process.exit(1);
	};
};

start();
