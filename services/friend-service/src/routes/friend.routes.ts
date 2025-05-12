import { FastifyInstance } from "fastify";
import { createFriend, deleteFriend, getFriend, getReceivingPendingRequest, getSendingPendingRequest, responseFriend } from "../controllers/friend.controllers";

export async function friendRoutes(app: FastifyInstance) {
	app.post('/friend/:id', createFriend);
	app.get('/friend', getFriend);
	app.put('/friend/:id', responseFriend);
	app.get('/friend/pending/send', getSendingPendingRequest);
	app.get('/friend/pending/receive', getReceivingPendingRequest);
	app.delete('/friend/:id', deleteFriend);
}
