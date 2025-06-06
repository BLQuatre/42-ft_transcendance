import axios from "axios";
import jwt from "jsonwebtoken";
import path from "path";
import dotenv from "dotenv";
import { FastifyReply, FastifyRequest } from "fastify";

dotenv.config({ path: path.resolve(__dirname, "../../../../.env.dev") });

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const GOOGLE_REDIRECT_URI = `https://${process.env.MAIN_HOST}:${process.env.MAIN_PORT}/api/auth/google/callback`;

export const googleRedir = async (req: FastifyRequest, reply: FastifyReply) => {
	const params = new URLSearchParams({
		client_id: GOOGLE_CLIENT_ID,
		redirect_uri: GOOGLE_REDIRECT_URI,
		response_type: "code",
		scope: "openid email profile",
		access_type: "offline",
		prompt: "consent",
	});

	const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

	return reply.redirect(redirectUrl);
};

export const googleLogSign = async (
	req: FastifyRequest,
	reply: FastifyReply
) => {
	const { code } = req.query as { code: string };
	if (!code) return reply.code(400).send({ error: "Missing code" });

	try {
		const tokenRes = await axios.post(
			"https://oauth2.googleapis.com/token",
			null,
			{
				params: {
					code,
					client_id: GOOGLE_CLIENT_ID,
					client_secret: GOOGLE_CLIENT_SECRET,
					redirect_uri: GOOGLE_REDIRECT_URI,
					grant_type: "authorization_code",
				},
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
			}
		);

		const profileRes = await axios.get(
			"https://www.googleapis.com/oauth2/v3/userinfo",
			{
				headers: {
					Authorization: `Bearer ${tokenRes.data.access_token}`,
				},
			}
		);

		const profile = profileRes.data;
		const findUser = await axios.post(
			`http://${process.env.USER_HOST}:${process.env.USER_PORT}/user/mail`,
			{
				email: profile.email,
			}
		);

		if (!findUser)
			return reply
				.code(500)
				.send({ error: "Internal server error (Find user)" });

		if (!findUser.data.isExist) {
			const createUser = await axios.post(
				`http://${process.env.USER_HOST}:${process.env.USER_PORT}/user/google`,
				{
					email: profile.email,
				}
			);

			if (!createUser)
				return reply
					.code(500)
					.send({ error: "Internal server error (Create user)" });

			const refreshToken = jwt.sign(
				{ id: createUser.data.user.id, name: createUser.data.user.name },
				process.env.JWT_REFRESH!,
				{ expiresIn: "7d" }
			);

			reply
				.setCookie("refreshToken", refreshToken, {
					httpOnly: true,
					secure: true,
					path: "/",
					sameSite: "strict",
					maxAge: 7 * 24 * 60 * 60,
				})
				.code(302)
				.redirect("/");
		} else {
			const refreshToken = jwt.sign(
				{ id: findUser.data.user.id, name: findUser.data.user.name },
				process.env.JWT_REFRESH!,
				{ expiresIn: "7d" }
			);

			reply
				.setCookie("refreshToken", refreshToken, {
					httpOnly: true,
					secure: true,
					path: "/",
					sameSite: "strict",
					maxAge: 7 * 24 * 60 * 60,
				})
				.code(302)
				.redirect("/");
		}
	} catch (err) {
		console.error("Google Callback Error: ", err);
		reply.code(500).send({ error: "Internal server error (Google Callback)" });
	}
};
