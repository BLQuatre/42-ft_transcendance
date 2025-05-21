import { FastifyReply, FastifyRequest } from "fastify";
import { getEnv } from "../utils/functions";
import dotenv from 'dotenv';
import axios from "axios";
import path from 'path';
import { OAuth2Client } from 'google-auth-library'

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const idClient = getEnv('ID_CLIENT');

const client = new OAuth2Client(idClient);

export const loginGoogle = async (req: FastifyRequest, reply: FastifyReply) => {
    const { token } = req.body as { token: string };

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: idClient
        });

        const payload = ticket.getPayload();

        if (!payload) {
            return reply.status(401).send({ message: "Invalid token", statusCode: 401});
        }

        const { email, name, picture, sub } = payload;

        // find if user exist if not create user with this info and set googleauth at true if he user exist but googleauth at false deny connection
    } catch (err) {
        req.log.error(err);
        return reply.code(401).send({ message: "authentication failed", statusCode: 401});
    }
}