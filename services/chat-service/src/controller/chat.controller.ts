import { FastifyRequest } from 'fastify';
import { WebSocket } from '@fastify/websocket';
import { ChatService } from '../services/chat.service';

interface ActiveConnection {
	userId: string;
	socket: WebSocket;
}

export class ChatController {
	private activeConnections: Map<string, ActiveConnection> = new Map();
	private chatService = new ChatService();

	async handleConnection(connection: WebSocket, request: FastifyRequest) {
		const { userId } = request.query as {userId: string};

		if (!userId) {
			connection.close(4000, 'User ID is required');
			return;
		}

		this.activeConnections.set(userId, { userId, socket: connection });

		connection.on('close', () => {
			this.activeConnections.delete(userId);
		});

		connection.on('message', async (message: string) => {
			try {
				const { type , data} = JSON.parse(message);

				switch (type) {
					case 'SEND_MESSAGE':
						await this.handleSendMessage(userId, data.receiverId, data.content);
						break;
					case 'GET_HISTORY':
						await this.handleGetHistory(userId, data.otherUserId);
						break;
					default:
						connection.send(JSON.stringify({
							type: 'ERROR',
							data: { message: 'Unknow message type' }
						}));
				}
			} catch (error: any) {
				connection.send(JSON.stringify({
					type: 'ERROR',
					data: { message: error.message }
				}));
			}
		});
	}

	private async handleSendMessage(senderId: string, receiverId: string, content: string) {
		const message = await this.chatService.saveMessage(senderId, receiverId, content);

		this.sendToUser(senderId, {
			type: 'MESSAGE_SENT',
			data: message
		});

		this.sendToUser(receiverId, {
			type: 'NEW_MESSAGE',
			data: message
		});
	}

	private async handleGetHistory(userId: string, otherUserId: string) {
		const message = await this.chatService.getMessageBetweenUsers(userId, otherUserId);
		this.sendToUser(userId, {
			type: 'MESSAGE_HISTORY',
			data: message
		});
	}

	private sendToUser(userId: string, message: any) {
		const connection = this.activeConnections.get(userId);
		if (connection) {
			connection.socket.send(JSON.stringify(message));
		}
	}
}