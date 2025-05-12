import { FastifyRequest, FastifyReply } from 'fastify';
import axios, { AxiosError, AxiosResponse } from 'axios';

export function isAxiosResponse(res: AxiosResponse | undefined): res is AxiosResponse{
	return res !== undefined
}

export const authPreHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	try {
		const response = await axios.get('http://localhost:3002/auth/access', {
			headers: {
				Authorization: request.headers.authorization || '',
			},
		});
		if (response.data.statusCode !== 200)
			return reply.code(401).send(response.data);

		// Transmet l'ID utilisateur dans les headers pour le proxy
		// console.log(response.data);
		request.headers['x-user-id'] = response.data.id;
		// console.log(`header : ${request.headers['x-user-id']}`);
	} catch (err) {
		const error = err as AxiosError;
		if (isAxiosResponse(error.response))
			return reply.code(error.response.status).send(error.response.data);

		return reply.code(401).send({
			message: 'authentication service error',
			statusCode: 401
		});
	}
};
