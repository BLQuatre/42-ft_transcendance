import { FastifyInstance } from "fastify";
import { loginGoogle } from "../controllers/google.controllers";

export async function googleAuthentication(app: FastifyInstance) {
    app.post('/auth/google', loginGoogle);
}