import { FastifyRequest, FastifyReply } from "fastify";
import { AppDataSource } from "../data-source";
import { FriendEntity } from "../entities/Friend";
import axios from "axios";
import { existsSync } from "fs";
import { friendRequestEnum } from "../utils/interface";

const Friend = AppDataSource.getRepository(FriendEntity);

export const createFriend = async (req: FastifyRequest, reply: FastifyReply) => {
	const sender_id = req.headers['x-user-id'] as string;
	const {id} = req.params as {id: string};
	if (!sender_id || !id)
		return reply.code(404).send({message: 'unable to define user', statusCode: 404});
	if (sender_id == id)
		return reply.code(403).send({message: 'forbidden to send friend request to herself', statusCode: 403});
	const findSender = await axios.get(`http://localhost:3001/user/${sender_id}`);
	const findReceiver = await axios.get(`http://localhost:3001/user/${id}`);
	// console.log(findSender.data);
	// console.log(findReceiver.data);
	if (findSender.data.statusCode !== 200 && findReceiver.data.statusCode !== 200)
		return reply.code(404).send({ message: 'unable to find sender or receiver', statusCode: 404});
	const isExist = await Friend.findOneBy({ sender_id: id, receiver_id: sender_id});
	if (isExist)
		return reply.code(409).send({ message: 'the friend request already exist', statusCode: 409});
	const friend : FriendEntity = {
		sender_id: sender_id, receiver_id: id,
		status: friendRequestEnum.PENDING,
		created_at: new Date(),
		updated_at: new Date()
	};
	Friend.save(friend);
	return reply.code(200).send({ message: 'Friend request send', statusCode: 201});
}

export const getFriend = async (req: FastifyRequest, reply: FastifyReply) => {
	const id = req.headers['x-user-id'] as string;
	if (!id)
		return reply.code(401).send({message: 'Unauthentified user', statusCode: 401});
	const friends = await Friend.find({where: [{sender_id: id , status: friendRequestEnum.ACCEPTED}, {receiver_id: id, status: friendRequestEnum.ACCEPTED}]
	});
	return reply.code(200).send({message: 'friend find', statusCode: 200, friends});
}

export const getSendingPendingRequest = async (req: FastifyRequest, reply: FastifyReply) => {
	const id = req.headers['x-user-id'] as string;
	if (!id)
		return reply.code(401).send({message: 'Unauthentified user', statusCode: 401});
	const friends = await Friend.find({where: {sender_id: id, status: friendRequestEnum.PENDING}})
	return reply.code(200).send({message: 'All sended request friend on pending', statusCode: 200, friends});
}

export const getReceivingPendingRequest = async (req: FastifyRequest, reply: FastifyReply) => {
	const id = req.headers['x-user-id'] as string;
	if (!id)
		return reply.code(401).send({message: 'Unauthentified user', statusCode: 401});
	const friends = await Friend.find({where: {receiver_id: id, status: friendRequestEnum.PENDING}})
	return reply.code(200).send({message: 'All reveived request friend on pending', statusCode: 200, friends});
}

export const responseFriend = async (req: FastifyRequest<{Body: {status: friendRequestEnum}}>, reply: FastifyReply) => {
	const userId = req.headers['x-user-id'] as string;
	const {id} = req.params as {id:string}
	if (!userId)
		return reply.code(401).send({message: 'Unauthentified user', statusCode:401});
	const user = await axios.get(`http://localhost:3001/user/${userId}`);
	if (user.data.statusCode === 404)
		return reply.code(404).send({message: 'Unable to find user', statusCode: 404});
	const friendRequest = await Friend.findOneBy({sender_id: id, receiver_id: userId})
	if (!friendRequest)
		return reply.code(404).send({message: 'Unable to find friend request', statusCode: 404})
	if (friendRequest.status != friendRequestEnum.PENDING)
		return reply.code(403).send({message: 'forbidden you have already respond to this friend request', statusCode: 403});
	await Friend.update(friendRequest, {status: req.body.status, updated_at: new Date()});
	return reply.code(200).send({message: 'request accpted', statusCode: 200});
}

export const deleteFriend = async (req:FastifyRequest, reply: FastifyReply) => {
	const userId = req.headers['x-user-id'] as string;
	const {id} = req.params as {id :string};
	if (!userId)
		return reply.code(401).send({message: 'Unauthentified user', statusCode:401});
	const friendRequest = await Friend.findOne(
		{
			where: [
				{
					sender_id: id, receiver_id:userId, status: friendRequestEnum.ACCEPTED
				}, 
				{
					sender_id:userId, receiver_id:id, status:friendRequestEnum.ACCEPTED
				}
			]
		}
	);
	if (!friendRequest)
		return reply.code(404).send({message: 'Nothing to delete', statusCode: 404});
	await Friend.delete(friendRequest);
	return reply.code(200).send({message: 'friend deleted with success', statusCode: 200});
}