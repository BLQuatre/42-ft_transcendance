import { FastifyInstance } from "fastify";
import { tfaActivate, tfaDelete, tfaSetup, tfaVerify } from "../controllers/2fa.controllers";

export async function twoFactorAuthentication(app: FastifyInstance){
    app.get('/auth/tfa/setup/:id', tfaSetup);
    app.post('/auth/tfa/verify/:id', tfaVerify);
    app.post('/auth/tfa/activate/:id', tfaActivate);
    app.post('/auth/tfa/delete/:id', tfaDelete);
}