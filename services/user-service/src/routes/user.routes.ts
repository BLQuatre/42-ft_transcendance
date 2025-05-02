import { FastifyInstance } from "fastify";
import { createUser, getAllUsers, getOneUser } from '../controllers/user.controllers';

export async function userRoutes(app: FastifyInstance) {
    app.get('/user', getAllUsers);
    app.post('/user', createUser);
    app.get('/user:id', getOneUser);
    // app.delete('/user', delAllUser);
}