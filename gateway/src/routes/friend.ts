import { FastifyPluginAsync } from "fastify";
import httpProxy from "@fastify/http-proxy";
import { authPreHandler } from "../utils/functions";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env.dev')});

export const friendRoutes: FastifyPluginAsync = async (fastify) => {
	fastify.register(httpProxy, {
		upstream: `http://${process.env.FRIEND_HOST}:${process.env.FRIEND_PORT}`,
		prefix: '/friend',
		rewritePrefix: '/friend',
		preHandler: authPreHandler
	});
};