import { FastifyReply, FastifyRequest } from "fastify";
import { AppDataSource} from '../data-source';
import { UserEntity } from "../entities/User";
import { validateBody } from "../utils/validate";
import { CreateUserDto } from "../entities/CreateUserDto";
import bcrypt from 'bcryptjs';
import { removePassword } from "../utils/functions";
import { CreatePasswordDto } from "../entities/CreatePasswordDto";
import { PublicUser } from "../utils/types";
import { LoginUser } from "../utils/interface";

const User = AppDataSource.getRepository(UserEntity);

export const getAllUsers = async (req: FastifyRequest, reply: FastifyReply) => {
	const usersFind = await User.find();
	const Users : PublicUser[] | [] = usersFind.map(removePassword);
	return reply.code(200).send({
		message: 'All users',
		statusCode: 200,
		Users
	});
};

export const getOneUser = async (req: FastifyRequest, reply: FastifyReply) => {
	const { id } = req.params as { id: string };
	try {
		const user = await User.findOneBy({ id: id })
		if (!user) {
			return reply.code(404).send({
				message: "unable to find user",
				statusCode: 404
			});
		}
		// TODO: Name of this function, removePassword return a publicUser ???
		const publicUser : PublicUser = removePassword(user);
		return reply.code(200).send({
			message: 'User find',
			statusCode: 200,
			user: {...publicUser}
		});

	} catch {
		return reply.code(404).send({
			message: 'unable to find user',
			statusCode: 404
		})
	}
}

export const createUser = async (req: FastifyRequest<{Body: CreateUserDto}>, reply: FastifyReply) => {
	const isValid = await validateBody(CreateUserDto)(req, reply);
	if (!isValid) return;

	try {
		const user = await User.save(req.body);

		return reply.code(201).send({
			message: 'User created',
			statusCode: 201,
			newUser: {
				name: user.name,
				id: user.id,
			}
		})
	} catch {
		return reply.code(409).send({
			message: 'User already exist',
			statusCode: 409
		});
	}
}

export const verifyUser = async (req: FastifyRequest<{Body: LoginUser}>, reply: FastifyReply) => {
	const userFind = await User.findOneBy({ name: req.body.name });
	if (!userFind) {
		return reply.code(404).send({
			message: 'Unable to find uuser',
			statusCode: 404
		});
	}

	const verif = await bcrypt.compare(req.body.password, userFind.password);
	if (!verif) {
		return reply.code(401).send({
			message: 'Unable to login, incorrect password',
			statusCode: 401
		});
	}

	const user = removePassword(userFind);
	return reply.code(200).send({
		message: 'User connected',
		statusCode: 200,
		user
	});
}

export const confirmPassword = async(req: FastifyRequest<{Body: {password: string}}>, reply: FastifyReply) => {
	const { id } = req.params as { id: string }

	const token = req.headers['x-user-id'];
	if (id !== token) {
		return reply.code(401).send({
			message: 'Unauthorized user',
			statusCode: 401
		});
	}

	const user = await User.findOneBy({ id: id })
	if (!user) {
		return reply.code(404).send({
			message: 'Unable to find user',
			statusCode: 404
		});
	}

	const verif = await bcrypt.compare(req.body.password, user.password);
	if (!verif) {
		return reply.code(401).send({
			message: 'Incorrect password',
			statusCode: 401
		});
	}
	return reply.code(200).send({
		message: 'Correct password',
		statusCode: 200
	});
}

export const updateUser = async (req: FastifyRequest<{Body: CreateUserDto}>, reply: FastifyReply) => {
	const { id } = req.params as { id: string };

	const token = req.headers['x-user-id'];
	if (id !== token) {
		return reply.code(401).send({
			message: 'Unauthorized to update this profile',
			statusCode: 401
		});
	}

	const userFind = await User.findOneBy({ id: id });
	if (!userFind) {
		return reply.code(404).send({
			message: 'Unable to find uuser',
			statusCode: 404
		});
	}

	const isValid = await validateBody(CreateUserDto)(req, reply);
	if (!isValid) return;

	await User.update(userFind.id, {
		name: req.body.name,
		updated_at: new Date()
	});

	const res = await User.findOneBy({ id: userFind.id })
	const user = removePassword(res);
	return reply.code(201).send({
		message: 'User updated',
		statusCode: 201,
		user
	});
}

export const updatePassword = async (req: FastifyRequest<{Body: CreatePasswordDto}>, reply: FastifyReply) => {
	const { id } = req.params as { id: string };

	const token = req.headers['x-user-id'];
	if (id !== token) {
		return reply.code(401).send({
			message: 'Unauthorized to update this profile',
			statusCode: 401
		})
	}

	const userFind = await User.findOneBy({ id: id });
	if (!userFind) {
		return reply.code(404).send({
			message: 'Unable to find user',
			statusCode: 404
		});
	}

	const isValid = await validateBody(CreatePasswordDto)(req, reply);
	if (!isValid) return;

	const verif = await bcrypt.compare(req.body.password, userFind.password);
	if (verif) {
		return reply.code(400).send({
			message: 'Your password can not be your actual password',
			statusCode: 400
		});
	}

	const hash = await bcrypt.hash(req.body.password, 10);
	await User.update(userFind.id, { password: hash });
	return reply.code(201).send({
		message: 'Password updated',
		statusCode: 201
	});
}

export const delUser = async (req: FastifyRequest, reply: FastifyReply) => {
	const { id } = req.params as { id: string };

	const token = req.headers['x-user-id'];
	if (id !== token) {
		return reply.code(401).send({
			message: 'Unauthorized to delete this profile',
			statusCode: 401
		});
	}
	const userFind = await User.findOneBy({ id: id })
	if (!userFind) {
		return reply.code(404).send({
			message: 'Unable to found user',
			statusCode: 404
		});
	}
	await User.delete(userFind.id);
	return reply.code(200).send({
		message: 'User deleted',
		statusCode: 200
	});
}
