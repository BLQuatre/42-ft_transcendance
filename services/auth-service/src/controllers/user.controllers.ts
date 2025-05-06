import { FastifyReply, FastifyRequest } from "fastify";
import { AppDataSource} from '../data-source';
import { UserEntity } from "../entities/User";
import { validateBody } from "../utils/validate";
import { CreateUserDto } from "../entities/CreateUserDto";
import bcrypt from 'bcryptjs';
import { removePassword, PublicUser, isLoginWithName, getenvVar } from "../utils/functions";
import { AuthRequest, loginWithEmailInterface, loginWithNameInterface } from "../utils/interface";
import dotenv from 'dotenv';
import path from "path";
import jwt from "jsonwebtoken";

(dotenv.config({ path: path.resolve(__dirname, '../../../.env') }));

const User = AppDataSource.getRepository(UserEntity);
const JWT_ACCES = getenvVar('JWT_ACCESS');
const JWT_REFRESH = getenvVar('JWT_REFRESH');


// dans le auth-service
export const signUp = async (req: FastifyRequest<{Body: CreateUserDto}>, reply: FastifyReply) => {
    const isValid = await validateBody(CreateUserDto)(req, reply);
    if (!isValid) return;
    const savedUser = req.body as CreateUserDto;
    savedUser.password_hash = await bcrypt.hash(savedUser.password_hash, 10);
    const result = await User.save(savedUser);
    if (!result){
        return reply.code(500).send({
            message: "Error internal sever",
            statusCode: 500
        })
    }
    const accessToken = jwt.sign({id: result.id}, JWT_ACCES, {expiresIn: '15m'});
    const refreshToken = jwt.sign({id: result.id}, JWT_REFRESH, {expiresIn: '7D'});
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
export const login = async (req: FastifyRequest<{ Body : loginWithEmailInterface | loginWithNameInterface}>, reply: FastifyReply) => {
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

export const authentication = async ( req: AuthRequest, reply: FastifyReply) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return reply.code(401).send({
            message: 'Unauthorize',
            statusCode: 401
        });
    }
    const token = authHeader.replace(/^Bearer\s+/, '');
    try {
        const decode = jwt.verify(token, JWT_ACCES);
        reply.code(200).send({
            message: 'authenticated',
            statusCode: 200,
            decode
        })
    } catch (err) {
        reply.code(401).send({
            message: 'wrong token',
            statusCode: 401
        })
    }
}