import { FastifyRequest, FastifyReply } from "fastify";
import { AppDataSource } from "../data-source";
import { FriendEntity } from "../entities/Friend";
import axios from "axios";
import { FriendRequestStatus } from "../utils/interface";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const Friend = AppDataSource.getRepository(FriendEntity);

export const createFriend = async (req: FastifyRequest, reply: FastifyReply) => {
	const senderId = req.headers['x-user-id'] as string;
	const { id } = req.params as { id: string };
	if (!senderId || !id) {
		return reply.code(404).send({
			message: 'unable to define user',
			statusCode: 404
		});
	}
	if (senderId == id) {
		return reply.code(403).send({
			message: 'forbidden to send friend request to herself',
			statusCode: 403
		});
	}

	const findSender = await axios.get(`http://${process.env.USER_HOST}:${process.env.USER_PORT}/user/${senderId}`);
	const findReceiver = await axios.get(`http://${process.env.USER_HOST}:${process.env.USER_PORT}/user/${id}`);
	if (findSender.data.statusCode !== 200 && findReceiver.data.statusCode !== 200) {
		return reply.code(404).send({
			message: 'unable to find sender or receiver',
			statusCode: 404
		});
	}

	const isExist = await Friend.findOne({where: [
		{ sender_id: id, receiver_id: senderId},
		{ sender_id: senderId, receiver_id: id}
	]});
	if (isExist) {
		if (isExist.status === FriendRequestStatus.BLOCKED)
			return reply.code(400).send({
				message: "Ok",
				statusCode: 400
			})
		return reply.code(409).send({
			message: 'the friend request already exist',
			statusCode: 409
		});
	}

	const friend : FriendEntity = {
		sender_id: senderId, receiver_id: id,
		status: FriendRequestStatus.PENDING,
		created_at: new Date(),
		updated_at: new Date()
	};
	Friend.save(friend);
	return reply.code(200).send({
		message: 'Friend request send',
		statusCode: 201
	});
}

export const getFriends = async (req: FastifyRequest, reply: FastifyReply) => {
	const id = req.headers['x-user-id'] as string;
	if (!id) {
		return reply.code(401).send({
			message: 'Unauthentified user',
			statusCode: 401
		});
	}

	const friends = await Friend.find({
		where: [
			{ sender_id: id , status: FriendRequestStatus.ACCEPTED },
			{ receiver_id: id, status: FriendRequestStatus.ACCEPTED }
		]
	});
	return reply.code(200).send({
		message: 'friend find',
		statusCode: 200,
		friends
	});
}

export const getSendingPendingRequest = async (req: FastifyRequest, reply: FastifyReply) => {
	const id = req.headers['x-user-id'] as string;
	if (!id) {
		return reply.code(401).send({
			message: 'Unauthentified user',
			statusCode: 401
		});
	}

	const friends = await Friend.find({
		where: { sender_id: id, status: FriendRequestStatus.PENDING }
	});
	return reply.code(200).send({
		message: 'All sended request friend on pending',
		statusCode: 200,
		friends
	});
}

export const getReceivingPendingRequest = async (req: FastifyRequest, reply: FastifyReply) => {
	const id = req.headers['x-user-id'] as string;
	if (!id) {
		return reply.code(401).send({
			message: 'Unauthentified user',
			statusCode: 401
		});
	}

	const friends = await Friend.find({
		where: { receiver_id: id, status: FriendRequestStatus.PENDING }
	})
	return reply.code(200).send({
		message: 'All reveived request friend on pending',
		statusCode: 200,
		friends
	});
}

export const getPendingRequests = async (req: FastifyRequest, reply: FastifyReply) => {
	const id = req.headers['x-user-id'] as string;
	if (!id) {
		return reply.code(401).send({
			message: 'Unauthentified user',
			statusCode: 401
		});
	}

	const friends = await Friend.find({
		where: [
			{ sender_id: id, status: FriendRequestStatus.PENDING },
			{ receiver_id: id, status: FriendRequestStatus.PENDING }
		]
	});
	return reply.code(200).send({
		message: 'All requests friend on pending',
		statusCode: 200,
		friends
	});
}

export const responseFriend = async (req: FastifyRequest<{ Body: { status: FriendRequestStatus } }>, reply: FastifyReply) => {
	const userId = req.headers['x-user-id'] as string;
	if (!userId) {
		return reply.code(401).send({
			message: 'Unauthentified user',
			statusCode: 401
		});
	}

	const user = await axios.get(`http://${process.env.USER_HOST}:${process.env.USER_PORT}/user/${userId}`);
	if (user.data.statusCode === 404) {
		return reply.code(404).send({
			message: 'Unable to find user',
			statusCode: 404
		});
	}

	const { id } = req.params as { id: string }
	const friendRequest = await Friend.findOneBy({ sender_id: id, receiver_id: userId })
	if (!friendRequest) {
		return reply.code(404).send({
			message: 'Unable to find friend request',
			statusCode: 404
		});
	}
	if (friendRequest.status != FriendRequestStatus.PENDING) {
		return reply.code(403).send({
			message: 'Forbidden you have already respond to this friend request',
			statusCode: 403
		});
	}
	if (req.body.status == FriendRequestStatus.REFUSED){
		Friend.delete(friendRequest);
		return reply.code(200).send({
			message: 'Friend declined',
			statusCode: 200
		})
	}
	await Friend.update(friendRequest, {
		status: req.body.status,
		updated_at: new Date()
	});
	return reply.code(200).send({
		message: 'Friend accepted',
		statusCode: 200
	});
}

export const deleteFriend = async (req:FastifyRequest, reply: FastifyReply) => {
	const userId = req.headers['x-user-id'] as string;
	if (!userId) {
		return reply.code(401).send({
			message: 'Unauthentified user',
			statusCode:401
		});
	}
	const { id } = req.params as { id: string };
	const friendRequest = await Friend.findOne({
		where: [
			{ sender_id: id, receiver_id: userId },
			{ sender_id: userId, receiver_id: id }
		]
	});
	if (!friendRequest) {
		return reply.code(404).send({
			message: 'Nothing to delete',
			statusCode: 404
		});
	}

	await Friend.delete(friendRequest);
	return reply.code(200).send({
		message: 'friend deleted with success',
		statusCode: 200
	});
}

export const blockFriend = async (req: FastifyRequest, reply: FastifyReply) => {
	const senderId = req.headers['x-user-id'] as string;
	const { id } = req.params as { id: string };
	if (!senderId || !id) {
		return reply.code(404).send({
			message: 'unable to define user',
			statusCode: 404
		});
	}
	if (senderId == id) {
		return reply.code(403).send({
			message: 'forbidden to send friend request to herself',
			statusCode: 403
		});
	}

	const findSender = await axios.get(`http://${process.env.USER_HOST}:${process.env.USER_PORT}/user/${senderId}`);
	const findReceiver = await axios.get(`http://${process.env.USER_HOST}:${process.env.USER_PORT}/user/${id}`);
	if (findSender.data.statusCode !== 200 && findReceiver.data.statusCode !== 200) {
		return reply.code(404).send({
			message: 'unable to find sender or receiver',
			statusCode: 404
		});
	}

	const isExist = await Friend.findOne({ where: [
		{sender_id: senderId, receiver_id: id}
	]});
	if (isExist) {
		await Friend.update(isExist, {status: FriendRequestStatus.BLOCKED})
		return reply.code(200).send({
			message: 'the friend request updated',
			statusCode: 200
		});
	}
	const senderOnreceiver = await Friend.findOneBy({sender_id: id, receiver_id: senderId})
	if (senderOnreceiver) {
		await Friend.delete(senderOnreceiver);
	}
	const friend : FriendEntity = {
		sender_id: senderId, receiver_id: id,
		status: FriendRequestStatus.BLOCKED,
		created_at: new Date(),
		updated_at: new Date()
	};
	Friend.save(friend);
	return reply.code(200).send({
		message: ' BLocked friend request success',
		statusCode: 201
	});
}

export const getBlockedList = async (req: FastifyRequest, reply: FastifyReply) => {
	const id = req.headers['x-user-id'] as string;
	if (!id) {
		return reply.code(401).send({
			message: 'Unauthentified user',
			statusCode: 401
		});
	}

	const friends = await Friend.find({
		where: [
			{ sender_id: id, status: FriendRequestStatus.BLOCKED }
		]
	});
	return reply.code(200).send({
		message: 'All blocked list',
		statusCode: 200,
		friends
	});
}