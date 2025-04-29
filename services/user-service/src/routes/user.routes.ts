import { FastifyInstance } from "fastify";
import { createUser, getAllUsers } from '../controllers/user.controllers';

export async function userRoutes(app: FastifyInstance) {
    app.get('/user', getAllUsers);
    app.post('/user', createUser);
}