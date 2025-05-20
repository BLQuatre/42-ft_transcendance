import { FastifyReply, FastifyRequest } from "fastify";
import { validateBody } from "../utils/validate";
import { CreateUserDto } from "../entities/CreateUserDto";
import bcrypt from 'bcryptjs';
import { removePassword, PublicUser, getEnv } from "../utils/functions";
import { LoginUser } from "../utils/interface";
import dotenv from 'dotenv';
import path from "path";
import jwt from "jsonwebtoken";
import axios from "axios";

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const JWT_ACCESS = getEnv('JWT_ACCESS');
const JWT_REFRESH = getEnv('JWT_REFRESH');

// dans le auth-service
export const register = async (req: FastifyRequest<{ Body: CreateUserDto }>, reply: FastifyReply) => {
	const isValid = await validateBody(CreateUserDto)(req, reply);
	if (!isValid) return;

	const savedUser = req.body as CreateUserDto;
	savedUser.password = await bcrypt.hash(savedUser.password, 10);

	const result = await axios.post(`http://${process.env.USER_HOST}:${process.env.USER_PORT}/user`, {
		name: savedUser.name,
		password: savedUser.password
	})
	.catch((err) => {
		if (err.response) {
			return reply.code(err.response.status).send({...err.response.data})
		}
		return reply.code(500).send({
			message: "Error internal sever",
			statusCode: 500
		})
	})

	if (result) {
		const accessToken = jwt.sign({ id: result.data.newUser.id, name: result.data.newUser.name }, JWT_ACCESS, { expiresIn: '15min' });
		const refreshToken = jwt.sign({ id: result.data.newUser.id, name: result.data.newUser.name }, JWT_REFRESH, { expiresIn: '7D' });
		const publicUser: PublicUser = removePassword(result.data.newUser);
		return reply
			.setCookie('refreshToken', refreshToken, {
				path: '/',
				httpOnly: true,
				secure: true,
				sameSite: 'strict',
				maxAge: 7 * 24 * 60 * 60
			})
			.code(201)
			.send({
				message: "User created",
				statusCode: 201,
				user: { ...publicUser },
				accessToken,
			});
	}
}

// dans le auth-service
export const login = async (req: FastifyRequest<{ Body: LoginUser }>, reply: FastifyReply) => {
	const response = await axios.post(`http://${process.env.USER_HOST}:${process.env.USER_PORT}/user/verify`, {
		...req.body
	})
	.catch((err) => {
		if (err.response) {
			return reply.code(err.response.status).send({
				...err.response.data
			});
		} else {
			return reply.code(500).send({
				message: "Internal server error",
				statusCode: 500
			});
		}
	})
	if (response) {
		return reply.code(response.data.statusCode).send(response.data);
	}
}
