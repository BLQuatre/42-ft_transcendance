import { FastifyReply } from "fastify";
import { getEnv } from "../utils/functions";
import { AuthRequest, MyJwtPayload } from "../utils/interface";
import dotenv from 'dotenv';
import path from "path";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import axios from 'axios';

dotenv.config({ path: path.resolve(__dirname, '../../../.env.dev') });

const JWT_ACCESS = getEnv('JWT_ACCESS');
const JWT_REFRESH = getEnv('JWT_REFRESH');

export const accessAuthentication = async (req: AuthRequest, reply: FastifyReply) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		return reply.code(401).send({
			message: 'Unauthorized',
			statusCode: 401
		});
	}

	const token = authHeader.replace(/^Bearer\s+/, '');
	try {
		const decode = jwt.verify(token, JWT_ACCESS) as MyJwtPayload;
		await axios.get(`http://${process.env.USER_HOST}:${process.env.USER_PORT}/user/${decode.id}`)
		reply.code(200).send({
			message: 'Authenticated',
			statusCode: 200,
			id: decode.id
		})
	} catch (err) {
		if (err instanceof TokenExpiredError) {
			return reply.code(401).send({
				message: 'Access token expired',
				statusCode: 401
			});
		} else if (err instanceof JsonWebTokenError) {
			return reply.code(401).send({
				message: 'Invalid access token',
				statusCode: 401
			});
		} else {
			return reply.code(500).send({
				message: 'Access token verification failed',
				statusCode: 500
			});
		}
	}
}

export const refreshAuthentication = async (req: AuthRequest, reply: FastifyReply) => {
	const authHeader = req.cookies.refreshToken;
	if (!authHeader) {
		return reply.code(401).send({
			message: 'Unauthorize',
			statusCode: 401
		});
	}

	const token = authHeader.replace(/^Bearer\s+/, '');
	try {
		const decode = jwt.verify(token, JWT_REFRESH) as MyJwtPayload;
		await axios.get(`http://${process.env.USER_HOST}:${process.env.USER_PORT}/user/${decode.id}`)
		const accessToken = jwt.sign({ id: decode.id, name: decode.name }, JWT_ACCESS, { expiresIn: '15min' });
		const refreshToken = jwt.sign({ id: decode.id, name: decode.name }, JWT_REFRESH, { expiresIn: '7D' });
		return reply
			.setCookie('refreshToken', refreshToken, {
				path: '/',
				httpOnly: true,
				secure: true,
				sameSite: 'strict',
				maxAge: 7 * 24 * 60 * 60
			})
			.code(200)
			.send({
				message: 'Refresh token authentified',
				statusCode: 200,
				accessToken,
				id: decode.id
		});
	} catch (err){
		if (err instanceof TokenExpiredError) {
			return reply.code(401).send({
				message: 'Refresh token expired',
				statusCode: 401
			});
		} else if (err instanceof JsonWebTokenError) {
			return reply.code(401).send({
				message: 'Invalid refresh token',
				statusCode: 401
			});
		} else {
			return reply.code(401).send({
				message: 'Refresh token verification failed',
				statusCode: 401
			});
		}
	}
}
