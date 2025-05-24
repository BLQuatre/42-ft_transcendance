import fastify, { FastifyReply, FastifyRequest } from "fastify";
import { AppDataSource} from '../data-source';
import { UserEntity } from "../entities/User";
import { validateBody } from "../utils/validate";
import { CreateUserDto } from "../entities/CreateUserDto";
import bcrypt from 'bcryptjs';
import { removePassword } from "../utils/functions";
import { CreatePasswordDto } from "../entities/CreatePasswordDto";
import { PublicUser } from "../utils/types";
import { LoginUser, SimpleTfaSecret} from "../utils/interface";
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

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
	if (userFind.isGoogleSignIn){
		return reply.code(400).send({
			message: "you can only to log in with google sing-in",
			statusCode: 400
		})
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

export const updateUser = async (req: FastifyRequest<{Body: { name?: string, avatar?: string }}>, reply: FastifyReply) => {
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

	const updated: { updated_at: Date, name?: string, avatar?: string | null } = {
		updated_at: new Date()
	}

	if (req.body.name) {
		const userName = await User.findOneBy({ name: req.body.name });
		if (userName) {
			return reply.code(409).send({
				message: 'User already exist',
				statusCode: 409
			});
		}
		updated.name = req.body.name;
	}

	updated.avatar = req.body.avatar === '' ? null : req.body.avatar;

	await User.update(userFind.id, updated as any);

	const res = await User.findOneBy({ id: userFind.id })
	if (!res)
		return reply.code(404).send({
			message: "User not found",
			statusCode: 404
		})
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
// test
export const badRoute = async (req: FastifyRequest, reply: FastifyReply) => {
	return reply.code(404).send({
		message: "unknow route",
		statusCode: 404
	});
}

export const setQrCode = async (
  req: FastifyRequest<{ Body: SimpleTfaSecret }>,
  reply: FastifyReply
) => {
  const { id } = req.params as { id: string };

  const user = await User.findOneBy({ id });

  if (!user) {
    return reply.code(404).send({
      message: "Unable to find user",
      statusCode: 404
    });
  }

  await User.update(user.id, {
    tfaSecret: req.body // 👈 typé et nettoyé
  });

  return reply.code(201).send({
    message: "QR code saved",
    statusCode: 201
  });
};

export const getQrCodeSecret = async ( req: FastifyRequest, reply: FastifyReply) => {
	const { id } = req.params as { id: string};

	const user = await User.findOneBy({id});

	if (!user){
		return reply.code(404).send({
			message: "unable to find user",
			statusCode: 404
		})
	}
	return reply.code(200).send({message: "request succesfull", statusCode: 200, secret:user.tfaSecret.base32});
}

export const heartbeat = async (req: FastifyRequest, reply: FastifyReply) => {
	const { id } = req.params as { id: string };

	await User.update(id, {
	lastSeenAt: new Date(),
	})

	return reply.code(200).send({ message: 'Ok', statusCode: 200});
}

export const findbyEmail = async (req: FastifyRequest, reply: FastifyReply) => {
	const { email } = req.body as { email: string}
	const user = await User.findOne({ where: { email }});
	if (!user)
		return reply.code(200).send({
			message: "User not Found",
			isExist: false
		})
	return reply.code(200).send({
		message: "User found",
		isExist: true,
		user
	})
}

export const createUserByGoogle = async (req: FastifyRequest, reply: FastifyReply) => {
	const { email } = req.body as { email: string, name: string };

	const newUser = await User.save({
		email: email,
		isGoogleSignIn: true,
		name: `${email.split('@')[0].slice(0, 10)}${Date.now()}`.slice(0, 20)
	});

	return reply.code(201).send({
		message: 'User created (Google Sign In)',
		statusCode: 201,
		user: {
			name: newUser.name,
			id: newUser.id,
		}
	})
}

export const activateTfa = async (req: FastifyRequest, reply: FastifyReply) => {
	const id = req.headers['x-user-id'] as string;
	const { token } = req.body as { token: string};
	const user = await User.findOneBy({ id });
	if (!user || !user.tfaSecret)
		return reply.code(404).send({
			message: "User not Found",
			isExist: false
		})
	const verified = speakeasy.totp.verify({
		secret: user.tfaSecret.base32,
		encoding: 'base32',
		token
	})
	if (!verified) {
			return reply.code(401).send({ message: "Invalid code", statusCode: 401})
		}
	await User.update(user.id, {
		tfaEnable: true
	})
	return reply.code(200).send({ message: "Tfa actived", statusCode: 200});
}

export const deleteTfa = async (req: FastifyRequest, reply: FastifyReply) => {
	const id = req.headers['x-user-id'] as string;
	const { token } = req.body as { token: string};
	const user = await User.findOneBy({ id });
	if (!user || !user.tfaSecret)
		return reply.code(404).send({
			message: "User not Found",
			isExist: false
		})
	const verified = speakeasy.totp.verify({
		secret: user.tfaSecret.base32,
		encoding: 'base32',
		token
	})
	if (!verified) {
			return reply.code(401).send({ message: "Invalid code", statusCode: 401})
		}
	await User.update(user.id, {
		tfaEnable: false,
		tfaSecret: undefined
	})
	return reply.code(200).send({ message: "Tfa desactivated", statusCode: 200});
}

export const tfaSetup = async (req: FastifyRequest, reply: FastifyReply) => {
	const id = req.headers['x-user-id'] as string;

	const user = await User.findOneBy({ id })
	if (!user)
		return reply.code(404).send({
			message: "User not found",
			statusCode: 404
		})
	const secret = speakeasy.generateSecret({
	  name: `ft_transcendance`
	});

	const cleanSecret = {
	  ascii: secret.ascii,
	  hex: secret.hex,
	  base32: secret.base32,
	  otpauth_url: secret.otpauth_url
	};

	await User.update(user.id, {
		tfaSecret: cleanSecret
	})

	const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url!);

	return reply.code(201).send({
	  message: "QR code generated",
	  statusCode: 201,
	  qrCodeUrl,
	  secret: (secret.otpauth_url || "secret=Error").split("secret=")[1]
	});
  };