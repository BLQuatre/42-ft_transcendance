import { FastifyInstance } from "fastify";
import {login, signUp } from '../controllers/user.controllers';
import { loginWithEmail, loginWithName} from "../utils/interface";
import { CreateUserDto } from "../entities/CreateUserDto";

export async function loginSingUp(app: FastifyInstance) {
    app.post<{Body: CreateUserDto}>('/auth/signup', signUp);
    app.post<{Body : loginWithName | loginWithEmail}>('/auth/login', login);
}