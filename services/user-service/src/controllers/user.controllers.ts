import { FastifyReply, FastifyRequest } from "fastify";
import { AppDataSource} from '../data-source';
import { User } from "../entities/User";

export const getAllUsers = async ( req: FastifyRequest, reply: FastifyReply) => {
    const userRepo = AppDataSource.getRepository(User);
    console.log('im here');
    const users = await userRepo.find();
    return reply.send(users);
};

export const createUser = async (req: FastifyRequest, reply: FastifyReply) => {
    const { name, email} = req.body as { name: string; email: string};
    const userRepo = AppDataSource.getRepository(User);
    const savedUser = userRepo.create({ name, email });
    const result = await userRepo.save(savedUser);
    return reply.code(201).send(result);
}