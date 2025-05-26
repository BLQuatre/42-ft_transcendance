import { FastifyInstance } from "fastify";
import {
	accessAuthentication,
	refreshAuthentication,
} from "../controllers/auth.controllers";

export async function authentication(app: FastifyInstance) {
	app.get("/auth/access", accessAuthentication);
	app.get("/auth/refresh", refreshAuthentication);
}
