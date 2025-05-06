import { FastifyInstance } from "fastify";
import {getAllUsers, getOneUser, login, signUp } from '../controllers/user.controllers';
import { loginWithEmail, loginWithName } from "../utils/interface";

export async function userRoutes(app: FastifyInstance) {
    app.get('/user', getAllUsers);
    app.get('/user/:id', getOneUser);
    // app.delete('/user', delAllUser);
}