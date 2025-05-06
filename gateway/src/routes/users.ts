import { FastifyPluginAsync } from 'fastify';
import httpProxy from '@fastify/http-proxy';
import axios from 'axios';

export const usersRoutes: FastifyPluginAsync = async (fastify) => {
	fastify.register(httpProxy, {
		upstream: 'http://localhost:3001',
		prefix: '/user',
		rewritePrefix: '/user',
		preHandler: async (request, reply) => {
				const authResponse = await axios.get('http://localhost:3002/auth/access', {
					headers: {
						Authorization: request.headers.authorization || '',
					},
				});
				if (authResponse.data.statusCode !== 200) {
					return reply.code(authResponse.data.statusCode).send({... authResponse});
				}
				request.headers['x-user-id'] = authResponse.data.id;
		},
	});
};

// export const userRoutes: FastifyPluginAsync = async (fastify) => {
// 	fastify.register(httpProxy, {
// 		upstream: 'http://localhost:3001',
// 		prefix: '/user/:id',
// 		rewritePrefix: '/user/:id'
// 	})
// }