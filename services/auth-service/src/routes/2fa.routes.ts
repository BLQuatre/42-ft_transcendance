import { FastifyInstance } from "fastify";
import { tfaVerify } from "../controllers/2fa.controllers";

export async function twoFactorAuthentication(app: FastifyInstance){
    app.post('/auth/tfa/verify/:id', tfaVerify);
}