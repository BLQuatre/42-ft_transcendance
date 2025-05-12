import { FastifyPluginAsync } from "fastify";
import httpProxy from "@fastify/http-proxy";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env')});

const authRoutes: FastifyPluginAsync = async (fastify) => {
	fastify.register(httpProxy, {
		upstream: `http://${process.env.AUTH_HOST}:${process.env.AUTH_PORT}`,
		prefix: '/auth',
		rewritePrefix: '/auth'
	});
};

export default authRoutes;