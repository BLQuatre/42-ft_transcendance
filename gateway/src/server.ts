import fastify from "fastify";
import websocket from '@fastify/websocket';
import WebSocket from 'ws';
import { usersRoutes } from './routes/users';
import authRoutes from "./routes/auth";
import { friendRoutes } from "./routes/friend";
import dotenv from 'dotenv';
import path from 'path';
import { chatRoutes } from "./routes/chat";
import { chatGeneralRoutes} from "./routes/chatGeneral";
dotenv.config({ path: path.resolve(__dirname, '../../../.env')});

const app = fastify({
	logger: process.env.DEBUG === 'true',
	
});

// app.register(userRoutes);
app.register(websocket);
app.register(authRoutes);
app.register(usersRoutes);
app.register(friendRoutes);
app.register(chatRoutes);
app.register(chatGeneralRoutes);

app.listen({
	host: process.env.GATEWAY_HOST,
	port: parseInt(process.env.GATEWAY_PORT || '0', 10)
}, (err, address) => {
	if (err) throw err;
	console.log(`[GATEWAY] Running on http://${process.env.GATEWAY_HOST}:${process.env.GATEWAY_PORT} (${address})`);
})
