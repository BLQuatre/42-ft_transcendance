import { FastifyPluginAsync } from "fastify";
import httpProxy from "@fastify/http-proxy";

const authRoutes: FastifyPluginAsync = async (fastify) => {
	fastify.register(httpProxy, {
		upstream: 'http://localhost:3002',
		prefix: '/auth',
		rewritePrefix: '/auth'
	});
};

export default authRoutes;