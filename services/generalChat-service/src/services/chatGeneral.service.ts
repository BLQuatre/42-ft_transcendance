import { ChatGeneral} from '../entities/ChatGeneral';
import { AppDataSource } from '../data-source';

export class ChatService {
    private chatGeneral = AppDataSource.getRepository(ChatGeneral);

    async saveMessage(content: string, userId: string, name: string) {
        const message = this.chatGeneral.create({
            content,
            userId,
            name
        });

        return await this.chatGeneral.save(message);
    }

    async getMessages(limit: number = 50) {
        return await this.chatGeneral.find({
            order: { created_at: 'DESC'},
            take: limit
        });
    }
}