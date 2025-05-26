import { Message } from "../entities/Message";
import { AppDataSource } from "../data-source";

export class ChatService {
	private messageRepository = AppDataSource.getRepository(Message);

	async saveMessage(
		senderId: string,
		receiverId: string,
		content: string
	): Promise<Message> {
		const message = this.messageRepository.create({
			senderId,
			receiverId,
			content,
		});
		return await this.messageRepository.save(message);
	}

	async getMessageBetweenUsers(
		user1Id: string,
		user2Id: string
	): Promise<Message[]> {
		return await this.messageRepository
			.createQueryBuilder("message")
			.where("(message.senderId = :user1Id AND message.receiverId = :user2Id)")
			.orWhere(
				"(message.senderId = :user2Id AND message.receiverId = :user1Id)"
			)
			.orderBy("message.created_at", "ASC")
			.setParameters({ user1Id, user2Id })
			.getMany();
	}

	async markMessageAsRead(senderId: string, receiverId: string): Promise<void> {
		await this.messageRepository
			.createQueryBuilder()
			.update(Message)
			.set({ isRead: true })
			.where(
				"senderId = :senderId AND receiverId = :receiverId AND isRead = fasle"
			)
			.setParameters({ senderId, receiverId })
			.execute();
	}
}
