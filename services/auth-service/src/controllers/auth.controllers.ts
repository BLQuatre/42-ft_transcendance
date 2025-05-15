import { FastifyReply } from "fastify";
import { getenvVar } from "../utils/functions";
import { AuthRequest, MyJwtPayload } from "../utils/interface";
import dotenv from 'dotenv';
import path from "path";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const JWT_ACCESS = getenvVar('JWT_ACCESS');
const JWT_REFRESH = getenvVar('JWT_REFRESH');

export const accessAuthentication = async (req: AuthRequest, reply: FastifyReply) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		return reply.code(401).send({
			message: 'Unauthorize',
			statusCode: 401
		});
	}

	const token = authHeader.replace(/^Bearer\s+/, '');
	try {
		const decode = jwt.verify(token, JWT_ACCESS) as MyJwtPayload;
		reply.code(200).send({
			message: 'authenticated',
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
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		return reply.code(401).send({
			message: 'Unauthorize',
			statusCode: 401
		});
	}

	const token = authHeader.replace(/^Bearer\s+/, '');
	try {
		const decode = jwt.verify(token, JWT_REFRESH) as MyJwtPayload;
		const accessToken = jwt.sign({ id: decode.id, name: decode.name }, JWT_ACCESS, { expiresIn: '15min' });
		const refreshtoken = jwt.sign({ id: decode.id, name: decode.name }, JWT_REFRESH, { expiresIn: '7D' });
		return reply.code(200).send({
			message: 'Refresh token authentified',
			statusCode: 200,
			accessToken,
			refreshtoken
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
			return reply.code(500).send({
				message: 'Refresh token verification failed',
				statusCode: 500
			});
		}
	}
}
