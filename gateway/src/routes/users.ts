import { FastifyPluginAsync } from 'fastify';
import httpProxy from '@fastify/http-proxy';
import { authPreHandler} from '../utils/functions';

export const usersRoutes: FastifyPluginAsync = async (fastify) => {
	fastify.register(httpProxy, {
		upstream: 'http://localhost:3001',
		prefix: '/user',
		rewritePrefix: '/user',
		preHandler: authPreHandler,
	});
};
