import { FastifyRequest } from "fastify";
import { JwtPayload } from "jsonwebtoken";

export interface LoginUser {
	name: string;
	password: string;
}

export interface AuthRequest extends FastifyRequest {
	headers: {
		authorization?: string;
	};
}

export interface MyJwtPayload extends JwtPayload {
	id: string;
	name: string;
}
