import Fastify from 'fastify';
import { WebSocketServer, WebSocket } from 'ws';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env.dev') });

const fastify = Fastify({
    logger: process.env.DEBUG === 'true',
});

interface Player {
	id: number;
	game: 'pong' | 'dino';
	socket: WebSocket;
}

let temp_id = 0;
const queues: Map<'pong' | 'dino', Player[]> = new Map();
queues.set('pong', []);
queues.set('dino', []);

const start = async () => {
    await fastify.listen({
        host: process.env.MATCHMAKING_HOST,
        port: parseInt(process.env.MATCHMAKING_PORT || "0", 10)
    });

    console.log(`Server running on http://${process.env.MATCHMAKING_HOST}:${process.env.MATCHMAKING_PORT}`);

    const wss = new WebSocketServer({ server: fastify.server });

    wss.on('connection', (ws) => {
        console.log('Client connected');

        let assignedPlayer: Player | null = null;

        ws.on('message', (message) => {
            const data = JSON.parse(message.toString());

            if (data.type === 'match') {
                const gameType: 'pong' | 'dino' = data.gameType;
                assignedPlayer = { id: temp_id++, game: gameType, socket: ws };

                const queue = queues.get(gameType);
                if (!queue) return;

                if (queue.length > 0) {
                    const opponent = queue.shift();
                    if (opponent) {
                        console.log(`Matched Player ${assignedPlayer.id} with Player ${opponent.id}`);

						const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();

                        // Send to both players the same roomId
                        const payload = JSON.stringify({
							type: 'matched',
                            roomId: newRoomId,
                        });
						
						assignedPlayer.socket.send(payload);
                        opponent.socket.send(payload);
                    }
                } else {
                    queue.push(assignedPlayer);
                    console.log(`Player ${assignedPlayer.id} added to ${gameType} queue`);
                }
            }
        });

        ws.on('close', () => {
            console.log('Client disconnected');

            if (assignedPlayer) {
                const queue = queues.get(assignedPlayer.game);
                if (queue) {
                    const index = queue.findIndex(p => p.id === assignedPlayer!.id);
                    if (index !== -1) queue.splice(index, 1);
                }
            }
        });
    });
};

start();
