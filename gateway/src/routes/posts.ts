import { FastifyPluginAsync } from "fastify";
import httpProxy from "@fastify/http-proxy";

const postsRoutes: FastifyPluginAsync = async (fastify) => {
	fastify.register(httpProxy, {
		upstream: 'http://localhost:3002',
		prefix: '/posts',
		rewritePrefix: '/posts',
	});
};

export default postsRoutes;