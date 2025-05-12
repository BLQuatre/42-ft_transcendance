import { FastifyReply, FastifyRequest } from "fastify";
import { AppDataSource} from '../data-source';
import { UserEntity } from "../entities/User";
import { validateBody } from "../utils/validate";
import { CreateUserDto } from "../entities/CreateUserDto";
import bcrypt from 'bcryptjs';
import { removePassword, PublicUser, isLoginWithName, getenvVar, isUserEntity } from "../utils/functions";
import { loginWithEmailInterface, loginWithNameInterface } from "../utils/interface";
import dotenv from 'dotenv';
import path from "path";
import jwt from "jsonwebtoken";

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const User = AppDataSource.getRepository(UserEntity);
const JWT_ACCESS = getenvVar('JWT_ACCESS');
const JWT_REFRESH = getenvVar('JWT_REFRESH');

// dans le auth-service
export const signUp = async (req: FastifyRequest<{ Body: CreateUserDto }>, reply: FastifyReply) => {
	const isValid = await validateBody(CreateUserDto)(req, reply);
	if (!isValid) return;

	const savedUser = req.body as CreateUserDto;
	savedUser.password = await bcrypt.hash(savedUser.password, 10);

	const result = await User.save(savedUser);
	if (!result){
		return reply.code(500).send({
			message: "Error internal sever",
			statusCode: 500
		})
	}

	const accessToken = jwt.sign({ id: result.id }, JWT_ACCESS, { expiresIn: '15min' });
	const refreshToken = jwt.sign({ id: result.id }, JWT_REFRESH, { expiresIn: '7D' });
	const publicUser: PublicUser = removePassword(result);
	return reply.code(201).send({
		message: "User created",
		statusCode: 201,
		publicUser,
		refreshToken,
		accessToken,
	});
}

// dans le auth-service
export const login = async (req: FastifyRequest<{ Body: loginWithEmailInterface | loginWithNameInterface }>, reply: FastifyReply) => {
	if (isLoginWithName(req.body)) {
		const user = await User.findOneBy({ name: req.body.name })
		if (!user) {
			return reply.code(404).send({
				message: 'User not found',
				statusCode: 404
			})
		}

		const verif = await bcrypt.compare(req.body.password, user.password);
		if (!verif) {
			return reply.code(401).send({
				message: "unable to login, identifiant incorrect",
				statusCode: 401
			});
		} else {
			const publicUser : PublicUser = removePassword(user);
			const accessToken = jwt.sign({ id: publicUser.id }, JWT_ACCESS, { expiresIn: '15min' });
			const refreshToken = jwt.sign({ id: publicUser.id }, JWT_REFRESH, { expiresIn: '7D' });
			return reply.code(202).send({
				message: "User is logged",
				statusCode: 202,
				publicUser,
				accessToken,
				refreshToken
			});
		}
	} else {
		const user = await User.findOneBy({ email: req.body.email })
		if (!isUserEntity(user)) {
			return reply.code(404).send({
				message: 'User not found',
				statusCode: 404
			})
		}

		const verif = await bcrypt.compare(req.body.password, user.password);
		if (!verif) {
			return reply.code(403).send({
				message: "unable to login, identifiant incorrect",
				statusCode: 401
			});
		} else {
			const publicUser : PublicUser = removePassword(user);
			const accessToken = jwt.sign({ id: publicUser.id }, JWT_ACCESS, { expiresIn: '15min' });
			const refreshToken = jwt.sign({ id: publicUser.id }, JWT_REFRESH, { expiresIn: '7D' });
			return reply.code(202).send({
				message: "User is logged",
				statusCode: 202,
				publicUser,
				accessToken,
				refreshToken
			});
		}
	}
}
