import { FastifyInstance } from "fastify";
import {
	blockFriend,
	createFriend,
	deleteFriend,
	getBlockedList,
	getFriends,
	getPendingRequests,
	getReceivingPendingRequest,
	getSendingPendingRequest,
	responseFriend,
} from "../controllers/friend.controllers";

export async function friendRoutes(app: FastifyInstance) {
	app.post("/friend/:id", createFriend);
	app.get("/friend", getFriends);
	app.put("/friend/:id", responseFriend);
	app.get("/friend/pending/send", getSendingPendingRequest);
	app.get("/friend/pending/receive", getReceivingPendingRequest);
	app.get("/friend/pending", getPendingRequests);
	app.delete("/friend/:id", deleteFriend);
	app.post("/friend/blocked/:id", blockFriend),
		app.get("/friend/blocked", getBlockedList);
}
