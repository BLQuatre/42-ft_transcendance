import { FastifyPluginAsync } from 'fastify';
import httpProxy from '@fastify/http-proxy';
import { authPreHandler} from '../utils/functions';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env.dev')});

export const historyRoutes: FastifyPluginAsync = async (fastify) => {
	fastify.register(httpProxy, {
		upstream: `http://${process.env.GAMEH_HOST}:${process.env.GAMEH_PORT}`,
		prefix: '/history',
		rewritePrefix: '/history',
		preHandler: authPreHandler,
	});
};