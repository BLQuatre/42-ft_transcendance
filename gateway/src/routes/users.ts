import { FastifyPluginAsync } from 'fastify';
import httpProxy from '@fastify/http-proxy';

const usersRoutes: FastifyPluginAsync = async (fastify) => {
	fastify.register(httpProxy, {
		upstream: 'http://localhost:3001',
		prefix: '/users',
		rewritePrefix: '/users',
	});
};

export default usersRoutes;