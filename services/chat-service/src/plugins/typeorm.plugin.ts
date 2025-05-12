import { FastifyPluginAsync } from "fastify";
import { AppDataSource } from "../data-source";

const typeormPlugin: FastifyPluginAsync = async (fastify) => {
	try {
		await AppDataSource.initialize();

		fastify.log.info('Connected to database');

		fastify.addHook('onClose', async () => {
			await AppDataSource.destroy();
		});
	} catch (error) {
		fastify.log.error(error);
		throw error;
	}
};

export default typeormPlugin;
