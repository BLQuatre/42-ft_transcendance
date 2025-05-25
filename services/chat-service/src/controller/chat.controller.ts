import { FastifyRequest } from 'fastify';
import { WebSocket } from '@fastify/websocket';
import { ChatService } from '../services/chat.service';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env.dev')});

interface ActiveConnection {
	user_id: string;
	socket: WebSocket;
}

interface SchemaId {
	user_id: string
}

export class ChatController {
	private activeConnections: Map<string, ActiveConnection> = new Map();
	private chatService = new ChatService();

	async handleConnection(connection: WebSocket, req: FastifyRequest) {
		const { user_id } = req.query as SchemaId

		if (!user_id) {
			connection.close(4000, 'User ID is required');
			return;
		}
		try {
			const dataUserId = await axios.get(`http://${process.env.USER_HOST}:${process.env.USER_PORT}/user/${user_id}`)

			this.activeConnections.set(user_id, { user_id: user_id, socket: connection });

			connection.on('close', () => {
				this.activeConnections.delete(user_id);
			});

			connection.on('message', async (message: string) => {
				console.log('[DEBUG] Received message:', message);
				const data = JSON.parse(message);

				switch (data.type) {
					case 'SEND_MESSAGE':
						await this.handleSendMessage(user_id, data.receiverId, data.content, dataUserId.data.user.name);
						break;
					case 'GET_HISTORY':
						console.log('[DEBUG] GET_HISTORY called', JSON.stringify(data));
						await this.handleGetHistory(user_id, data.receiverId);
						break;
					default:
						connection.send(JSON.stringify({
							type: 'ERROR',
							data: { message: 'Unknow message type' }
						}));
				}
			})
		} catch (err) {
			connection.send(JSON.stringify({
				type: 'ERROR',
				message: 'user not found'
			}))
		}
	}

	private async handleSendMessage(senderId: string, receiverId: string, content: string, senderName: string) {
		const message = await this.chatService.saveMessage(senderId, receiverId, content);
		const recId = await axios.get(`http://${process.env.USER_HOST}:${process.env.USER_PORT}/user/${receiverId}`)
		.catch(() => {
			this.sendToUser(senderId, {
				type: 'ERROR',
				data: { message: 'undefined user'}
			})
		})

		if (recId) {
			this.sendToUser(senderId, {
				type: 'MESSAGE_SENT',
				data: message,
				receiverName: recId.data.user.name,
				senderName
			});

			this.sendToUser(receiverId, {
				type: 'NEW_MESSAGE',
				data: message,
				receiverName: recId.data.user.name,
				senderName
			});
		}
	}

	private async handleGetHistory(userId: string, otherUserId: string) {
		console.log('[DEBUG] handleGetHistory called', { userId, otherUserId });

		try {
			const otherIdUser = await axios.get(`http://${process.env.USER_HOST}:${process.env.USER_PORT}/user/${otherUserId}`);

			const messages = await this.chatService.getMessageBetweenUsers(userId, otherUserId);
			const msg = messages.map(message => ({
				...message,
				name: otherIdUser.data.user.name
			}))
			this.sendToUser(userId, {
				type: 'SENT_HISTORY',
				data: msg,
			});
		} catch (error) {
			console.error('[ERROR] Error in handleGetHistory:', error);

			this.sendToUser(userId, {
				type: 'ERROR',
				data: { message: 'Not found user for this history' }
			});
		}
	}

	private sendToUser(userId: string, message: any) {
		const connection = this.activeConnections.get(userId);
		if (connection) {
			connection.socket.send(JSON.stringify(message));
		}
	}
}
