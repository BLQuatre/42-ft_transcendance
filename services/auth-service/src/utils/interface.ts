import { FastifyRequest } from "fastify";
import { JwtPayload} from 'jsonwebtoken'

export interface loginWithNameInterface{
	name: string;
	password: string
}

export interface loginWithEmailInterface{
	email: string;
	password: string
}

export interface AuthRequest extends FastifyRequest {
	headers: {
		authorization? : string
	}
}

export interface MyJwtPayload extends JwtPayload {
	id: string;
}
