import { FastifyInstance } from "fastify";
import {confirmPassword, delUser, getAllUsers, getOneUser, updatePassword, updateUser, createUser, logWithName} from '../controllers/user.controllers';

export async function userRoutes(app: FastifyInstance) {
	app.get('/user', getAllUsers);
	app.get('/user/:id', getOneUser);
	app.post('/user', createUser);
	app.post('/user/confirmpassword/:id', confirmPassword);
	app.put('/user/:id', updateUser);
	app.put('/user/password/:id', updatePassword);
	app.delete('/user/:id', delUser);
	app.post('/user/name', logWithName)
	// app.get('/user/*', badRoute);
}