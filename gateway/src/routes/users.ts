import { FastifyPluginAsync } from 'fastify';
import httpProxy from '@fastify/http-proxy';
import { authPreHandler} from '../utils/functions';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env.dev')});

export const usersRoutes: FastifyPluginAsync = async (fastify) => {
	fastify.register(httpProxy, {
		upstream: `http://${process.env.USER_HOST}:${process.env.USER_PORT}`,
		prefix: '/user',
		rewritePrefix: '/user',
		preHandler: authPreHandler,
	});
};
