import { FastifyInstance } from "fastify";
import { login, signUp } from '../controllers/user.controllers';
import { loginWithNameInterface } from "../utils/interface";
import { CreateUserDto } from "../entities/CreateUserDto";

export async function loginSingUp(app: FastifyInstance) {
	app.post<{ Body: CreateUserDto }>('/auth/register', signUp);
	app.post<{ Body: loginWithNameInterface}>('/auth/login', login);
}
