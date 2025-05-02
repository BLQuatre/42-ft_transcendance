import { FastifyInstance } from "fastify";
import { createUser, getAllUsers, getOneUser, login } from '../controllers/user.controllers';
import { loginWithEmail, loginWithName } from "../utils/interface";

export async function userRoutes(app: FastifyInstance) {
    app.get('/user', getAllUsers);
    app.post('/user', createUser);
    app.get('/user/:id', getOneUser);
    app.post<{Body : loginWithName | loginWithEmail}>('/user/login', login);
    // app.delete('/user', delAllUser);
}