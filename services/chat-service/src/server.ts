import { buildApp } from "./app";

const start = async () => {
	const app = await buildApp();

	try {
		await app.listen({ port: 3004, host: '0.0.0.0'});
		app.log.info(`Server listening on port 3004`);
	} catch (err) {
		app.log.error(err);
		process.exit(1);
	};
};

start();