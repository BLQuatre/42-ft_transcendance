import { FastifyInstance } from "fastify";
import { confirmPassword, createUser, delUser, getAllUsers, getOneUser, updatePassword, updateUser } from '../controllers/user.controllers';
import { CreateUserDto } from "../entities/CreateUserDto";

export async function userRoutes(app: FastifyInstance) {
	app.get('/user', getAllUsers);
	app.get('/user/:id', getOneUser);
	app.post('/user', createUser);
	app.post('/user/confirmpassword/:id', confirmPassword);
	app.put('/user/:id', updateUser);
	app.put('/user/password/:id', updatePassword);
	app.delete('/user/:id', delUser);
}
