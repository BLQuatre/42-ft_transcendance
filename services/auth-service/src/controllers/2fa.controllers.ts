import { FastifyRequest, FastifyReply } from "fastify";
import dotenv from 'dotenv';
import path from 'path';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

dotenv.config({ path: path.resolve(__dirname, '../../../.env')})

export const tfaSetup = async (req: FastifyRequest, reply: FastifyReply) => {

}
