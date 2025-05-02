import { FastifyPluginAsync } from 'fastify';
import httpProxy from '@fastify/http-proxy';

export const usersRoutes: FastifyPluginAsync = async (fastify) => {
	fastify.register(httpProxy, {
		upstream: 'http://localhost:3001',
		prefix: '/user',
		rewritePrefix: '/user',
	});
};

export const userRoutes: FastifyPluginAsync = async (fastify) => {
	fastify.register(httpProxy, {
		upstream: 'http://localhost:3001',
		prefix: '/user/:id',
		rewritePrefix: '/user/:id'
	})
}