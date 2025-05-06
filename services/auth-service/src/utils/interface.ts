import { FastifyRequest } from "fastify";

export interface loginWithNameInterface{
    name: string;
    password: string
}

export interface loginWithEmailInterface{
    email: string;
    password: string
}

export interface AuthRequest extends FastifyRequest {
    headers: {
        authorization? : string
    }
}