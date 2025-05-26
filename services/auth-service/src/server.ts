import "reflect-metadata";
import path from "path";
import dotenv from "dotenv";
import fastify, { FastifyReply, FastifyRequest } from "fastify";
import { loginSingUp } from "./routes/user.routes";
import { authentication } from "./routes/auth.routes";
import fastifyCookie from "@fastify/cookie";
import { twoFactorAuthentication } from "./routes/2fa.routes";
import { authRoutes } from "./routes/google.route";

dotenv.config({ path: path.resolve(__dirname, "../../../.env.dev") });

const app = fastify({
	logger: process.env.DEBUG === "true",
});

app.register(fastifyCookie, {
	secret: process.env.COOKIE_SECRET,
});

app.register(loginSingUp);
app.register(authentication);
app.register(twoFactorAuthentication);
app.register(authRoutes);

app.listen(
	{
		host: process.env.AUTH_HOST,
		port: parseInt(process.env.AUTH_PORT || "0", 10),
	},
	(err, address) => {
		if (err) {
			app.log.error(err);
			process.exit(1);
		}
		app.log.info(
			`[AUTH] Running on http://${process.env.AUTH_HOST}:${process.env.AUTH_PORT} (${address})`
		);
	}
);
