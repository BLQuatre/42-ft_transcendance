import Fastify from 'fastify';
import { WebSocketServer, WebSocket } from 'ws';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env.dev') });

const fastify = Fastify({
	logger: process.env.DEBUG === 'true',
});


const PONG_RANGE_WIDE	= 10
const PONG_HARD_CAP		= 50
const DINO_RANGE_WIDE	= 200
const DINO_HARD_CAP		= 1000

interface Player {
	id: string;
	game: 'pong' | 'dino';
	socket: WebSocket;
	elo: number // either win-rate for pong or best score for dino run
	range: number // how distant from its elo a player can match another
}

const queues: Map<'pong' | 'dino', Player[]> = new Map();
queues.set('pong', []);
queues.set('dino', []);

const widenTimers = new Map<string, NodeJS.Timeout>();


function widenRange(player: Player) {
	const interval = setTimeout(() => {
		player.range += (player.game === 'pong' ? PONG_RANGE_WIDE : DINO_RANGE_WIDE);

		const hardCap = player.game === 'pong' ? PONG_HARD_CAP : DINO_HARD_CAP;
		if (player.range < hardCap) {
			widenRange(player);
			
			try			{ player.socket.send(JSON.stringify({ type: 'widening' })); }
			catch (err)	{ console.error("Failed to send match payload:", err); }
		} else {
			widenTimers.delete(player.id); // Done widening
		}
	}, 10000);

	widenTimers.set(player.id, interval);
}

function clearWidenRange(playerId: string) {
	const timer = widenTimers.get(playerId);
	if (timer) {
		clearTimeout(timer);
		widenTimers.delete(playerId);
	}
}


function matchmakingSweep() {
	for (const [game, queue] of queues.entries()) {
		// Track players already matched to avoid reprocessing
		const matched = new Set<string>();

		for (let i = 0; i < queue.length; i++) {
			if (matched.has(queue[i].id)) continue;

			for (let j = i + 1; j < queue.length; j++) {
				if (matched.has(queue[j].id)) continue;

				const a = queue[i];
				const b = queue[j];

				const eloDiff = Math.abs(a.elo - b.elo);
				if (eloDiff <= a.range && eloDiff <= b.range) {
					// Found a match
					const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
					const payload = JSON.stringify({ type: 'matched', roomId: newRoomId });

					try {
						a.socket.send(payload);
						b.socket.send(payload);
					} catch (err) {
						console.error("Failed to send match payload:", err);
					}

					matched.add(a.id);
					matched.add(b.id);

					clearWidenRange(a.id);
					clearWidenRange(b.id);

					break;
				}
			}
		}

		// Remove matched players from queue
		queues.set(game, queue.filter(p => !matched.has(p.id)));
	}
}

const start = async () => {
	await fastify.listen({
		host: process.env.MATCHMAKING_HOST,
		port: parseInt(process.env.MATCHMAKING_PORT || "0", 10)
	});

	console.log(`Server running on http://${process.env.MATCHMAKING_HOST}:${process.env.MATCHMAKING_PORT}`);


	const wss = new WebSocketServer({ server: fastify.server });

	setInterval(matchmakingSweep, 5000); // check for matchs every 5 seconds

	wss.on('connection', (ws) => {
		console.log('Client connected');

		let assignedPlayer: Player | null = null;

		ws.on('message', (message) => {
			const data = JSON.parse(message.toString());

			if (data.type === 'match') {
				if (typeof data.uuid !== 'string' ||
					typeof data.elo !== 'number' ||
					(data.gameType !== 'pong' && data.gameType !== 'dino')
				) {
					console.log('close because wrong data')
					console.log(`data.uuid = ${data.uuid}, data.elo = ${data.elo}, data.gameType = ${data.gameType}`)
					ws.close();
					return;
				}
				
				const uuid: string = data.uuid;
				const gameType: 'pong' | 'dino' = data.gameType;
				const elo: number = data.elo;
				
				const queue = queues.get(gameType);
				if (!queue || queue.some(p => p.id === data.uuid)) { // Prevent same player from queuing twice in the same game
					console.log('close because already in queue')
					ws.close();
					return;
				}

				assignedPlayer = { id: uuid, game: gameType, socket: ws, elo: elo, range: (gameType === 'pong' ? PONG_RANGE_WIDE : DINO_RANGE_WIDE) };

				widenRange(assignedPlayer) ;

				queue.push(assignedPlayer);
				console.log(`Player ${assignedPlayer.id} added to ${gameType} queue`);
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
				clearWidenRange(assignedPlayer.id);
			}
		});
	});
};

start();
