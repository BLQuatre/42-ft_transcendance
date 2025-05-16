import { FastifyInstance } from "fastify";
import { login, register } from '../controllers/user.controllers';
import { LoginUser } from "../utils/interface";
import { CreateUserDto } from "../entities/CreateUserDto";

export async function loginSingUp(app: FastifyInstance) {
	app.post<{ Body: CreateUserDto }>('/auth/register', register);
	app.post<{ Body: LoginUser }>('/auth/login', login);
}
