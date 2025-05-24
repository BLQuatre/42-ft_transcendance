import { FastifyInstance } from "fastify";
import { activateTfa, confirmPassword, createUser, createUserByGoogle, deleteTfa, delUser, findbyEmail, getAllUsers, getOneUser, getQrCodeSecret, heartbeat, setQrCode, updatePassword, updateUser, verifyUser } from '../controllers/user.controllers';

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
	app.get('/user/heartbeat/:id', heartbeat);
	app.post('/user/mail', findbyEmail);
	app.post('/user/google', createUserByGoogle);
	app.get('/user/tfa-activate/:id', activateTfa);
	app.get('/user/tfa-delete/:id', deleteTfa);
}
	// app.get('/user/*', badRoute);
