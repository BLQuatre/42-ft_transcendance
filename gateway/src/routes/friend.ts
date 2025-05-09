import { FastifyPluginAsync } from "fastify";
import httpProxy from "@fastify/http-proxy";
import { authPreHandler } from "../utils/functions";

export const friendRoutes: FastifyPluginAsync = async (fastify) => {
	fastify.register(httpProxy, {
		upstream: 'http://localhost:3003',
		prefix: '/friend',
		rewritePrefix: '/friend',
		preHandler: authPreHandler
	});
};