import { FastifyInstance } from "fastify";
import {authentication, login, signUp } from '../controllers/user.controllers';
import { AuthRequest, loginWithEmailInterface, loginWithNameInterface} from "../utils/interface";
import { CreateUserDto } from "../entities/CreateUserDto";

export async function loginSingUp(app: FastifyInstance) {
    app.post<{Body: CreateUserDto}>('/auth/signup', signUp);
    app.post<{Body : loginWithNameInterface | loginWithEmailInterface }>('/auth/login', login);
    app.get('/auth', authentication);
}