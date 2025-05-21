import { FastifyInstance } from "fastify";
import { confirmPassword, createUser, delUser, getAllUsers, getOneUser, getQrCodeSecret, setQrCode, updatePassword, updateUser, verifyUser } from '../controllers/user.controllers';

export async function userRoutes(app: FastifyInstance) {
	app.get('/user', getAllUsers);
	app.get('/user/:id', getOneUser);
	app.post('/user/verify', verifyUser);
	app.post('/user', createUser);
	app.post('/user/confirmpassword/:id', confirmPassword);
	app.put('/user/:id', updateUser);
	app.put('/user/password/:id', updatePassword);
	app.delete('/user/:id', delUser);
	app.post("/user/qrcode/:id", setQrCode);
	app.get('/user/secret/:id', getQrCodeSecret);
}
	// app.get('/user/*', badRoute);
