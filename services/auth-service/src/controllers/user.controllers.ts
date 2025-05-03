import { FastifyReply, FastifyRequest } from "fastify";
import { AppDataSource} from '../data-source';
import { UserEntity } from "../entities/User";
import { validateBody } from "../utils/validate";
import { CreateUserDto } from "../entities/CreateUserDto";
import bcrypt from 'bcryptjs';
import { removePassword, PublicUser, isLoginWithName, getenvVar } from "../utils/functions";
import { loginWithEmail, loginWithName } from "../utils/interface";
import dotenv from 'dotenv';
import path from "path";

(dotenv.config({ path: path.resolve(__dirname, '../../../.env') }));

const User = AppDataSource.getRepository(UserEntity);


// dans le auth-service
export const signUp = async (req: FastifyRequest<{Body: CreateUserDto}>, reply: FastifyReply) => {
    const isValid = await validateBody(CreateUserDto)(req, reply);
    if (!isValid) return;
    const savedUser = req.body as CreateUserDto;
    savedUser.password_hash = await bcrypt.hash(savedUser.password_hash, 10);
    const result = await User.save(savedUser);
    const publicUser: PublicUser = removePassword(result);
    return reply.code(201).send({
        message: "User created",
        statusCode: 201,
        publicUser
    });
}
// dans le auth-service
export const login = async (req: FastifyRequest<{ Body : loginWithEmail | loginWithName}>, reply: FastifyReply) => {
    if (isLoginWithName(req.body)) {
        const user = await User.findOneBy({
            name: req.body.name
        })
        if (!user)
            return reply.code(404).send({
                message: 'User not found',
                statusCode: 404
            })
        const verif = await bcrypt.compare(req.body.password, user.password_hash);
        if (!verif)
            return reply.code(401).send({message: "unable to login, identifiant incorrect", statusCode: 401});
        else{
            const publicUser : PublicUser = removePassword(user);
            return reply.code(202).send({message: "User is logged", statusCode: 202, publicUser});
        }
    } else {
        const user = await User.findOneBy({
            email: req.body.email
        })
        if (!user)
            return reply.code(404).send({
                message: 'User not found',
                statusCode: 404
            })
        const verif = await bcrypt.compare(req.body.password, user.password_hash);
        if (!verif)
            return reply.code(401).send({message: "unable to login, identifiant incorrect", statusCode: 401});
        else{
            const publicUser : PublicUser = removePassword(user);
            return reply.code(202).send({message: "User is logged", statusCode: 202, publicUser});
        }
    }
}