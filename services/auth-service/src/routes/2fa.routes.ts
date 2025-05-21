import { FastifyInstance } from "fastify";
import { tfaSetup, tfaVerify } from "../controllers/2fa.controllers";

export async function twoFactorAuthentication(app: FastifyInstance){
    app.get('/auth/tfa/setup/:id', tfaSetup);
    app.post('/auth/tfa/verify/:id', tfaVerify);
}