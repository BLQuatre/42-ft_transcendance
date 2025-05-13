import { FastifyReply, FastifyRequest } from "fastify";
import { validateBody } from "../utils/validate";
import { CreateUserDto } from "../entities/CreateUserDto";
import bcrypt from 'bcryptjs';
import { removePassword, PublicUser, getenvVar } from "../utils/functions";
import { loginWithNameInterface } from "../utils/interface";
import dotenv from 'dotenv';
import path from "path";
import jwt from "jsonwebtoken";
import axios from "axios";

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const JWT_ACCESS = getenvVar('JWT_ACCESS');
const JWT_REFRESH = getenvVar('JWT_REFRESH');

// dans le auth-service
export const signUp = async (req: FastifyRequest<{ Body: CreateUserDto }>, reply: FastifyReply) => {
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
		return reply.code(201).send({
			message: "User created",
			statusCode: 201,
			user: {
				...publicUser
			},
			refreshToken,
			accessToken,
		});
	}
}

// dans le auth-service
export const login = async (req: FastifyRequest<{ Body: loginWithNameInterface }>, reply: FastifyReply) => {
	const user = await axios.post(`http://${process.env.USER_HOST}:${process.env.USER_PORT}/user/name`, {
		...req.body
	})
	.catch((err) => {
		if (err.response){
			return reply.code(err.response.status).send({...err.response.data})
		}
		else
			return reply.code(500).send({message: "Error server intern", statusCode: 500});
	})
	if (user){
		const verif = await bcrypt.compare(req.body.password, user.data.user.password);
		if (!verif) {
			return reply.code(401).send({
				message: "unable to login, identifiant incorrect",
				statusCode: 401
			});
		} else {
			const publicUser : PublicUser = removePassword(user.data.user);
			const accessToken = jwt.sign({ id: publicUser.id ,name: publicUser.name }, JWT_ACCESS, { expiresIn: '15min' });
			const refreshToken = jwt.sign({ id: publicUser.id, name: publicUser.name }, JWT_REFRESH, { expiresIn: '7D' });
			return reply.code(202).send({
				message: "User is logged",
				statusCode: 202,
				user: {
					...publicUser
				},
				accessToken,
				refreshToken
			});
		}
	}
}
