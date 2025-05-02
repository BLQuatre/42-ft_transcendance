import { FastifyReply, FastifyRequest } from "fastify";
import { AppDataSource} from '../data-source';
import { User } from "../entities/User";
import { validateBody } from "../utils/validate";
import { CreateUserDto } from "../entities/CreateUserDto";
const user = AppDataSource.getRepository(User);

export const getAllUsers = async ( req: FastifyRequest, reply: FastifyReply) => {
    const users = await user.find();
    return reply.send(users);
};

export const getOneUser = async ( req: FastifyRequest, reply: FastifyReply) => {
    const id = req.id;
    console.log(id);
    const findUser = await user.findOneBy({
        id: id
    })
    if (!findUser)
        return reply.code(404).send({
            message: "unable to find user" 
        });
    return reply.code(200).send(findUser);
}

export const createUser = async (req: FastifyRequest, reply: FastifyReply) => {
    // const { name, email} = req.body as { name: string; email: string};
    const isValid = await validateBody(CreateUserDto)(req, reply);
    if (!isValid) return;
    const savedUser = req.body as CreateUserDto;
    const result = await user.save(savedUser);
    return reply.code(201).send(result);
}

// export const delAllUser = async (req: FastifyRequest, reply: FastifyReply) => {
//     const delUser = await user.delete({
//         id: 1
//     });
//     // const result = await user.save;
//     return reply.code(202).send(delUser);
// }