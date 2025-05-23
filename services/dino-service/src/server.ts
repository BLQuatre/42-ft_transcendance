import Fastify from 'fastify' ;
import { WebSocketServer } from 'ws' ;
import { Room } from './room';
import { Player } from './player';
import * as CONST from './constants' ;
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env.dev')});

const fastify = Fastify({
    logger: process.env.DEBUG === 'true',
}) ;

let id = 0 ;
const rooms: Map<string, Room> = new Map() ;

const start = async () => {
	await fastify.listen({
        host: process.env.DINO_HOST,
        port: parseInt(process.env.DINO_PORT || "0", 10)
    }).catch(console.error) ;

    console.log(`Server running on http://${process.env.DINO_HOST}:${process.env.DINO_PORT}`); ;

	const wss = new WebSocketServer({ server: fastify.server }) ;

	wss.on('connection', (ws) => {
		console.log('Client connected') ;

		let assignedPlayer: Player | null = null;
        let currentRoom: Room | null = null;

		ws.on('message', (message) => {
            const data = JSON.parse(message.toString());

            if (data.type === 'join_room') {
                const roomId = data.roomId;
                if (!rooms.has(roomId)) {
                    rooms.set(roomId, new Room(roomId));
                }
                currentRoom = rooms.get(roomId)!;

                if (currentRoom.getPlayers().length < CONST.MAX_PLAYERS && !currentRoom.getGame()) {
                    assignedPlayer = new Player(++id, ws);
                    currentRoom.addPlayer(assignedPlayer);

                    // Notify the player of their ID
                    ws.send(JSON.stringify({ type: 'assign', playerId: assignedPlayer.getId() }));

                    // Broadcast room update
                    broadcastRoomUpdate(currentRoom);
                } else {
                    ws.close(); // Room is full
                }
            }

            if (data.type === 'toggle_ready' && assignedPlayer && currentRoom) {
                assignedPlayer.toggleReadyState(); // Use the Player class method

                // Check if all players are ready to start the game
                if (currentRoom.getPlayers().every((p) => p.isReady())) {
                    broadcastToRoom(currentRoom, { type: 'game_start' });
                    startGame(currentRoom);
                } else {
                    broadcastRoomUpdate(currentRoom);
                }
            }

			if ((data.type === 'jump' || data.type === 'up' || data.type === 'down') && data.playerId) {
				if (assignedPlayer?.getId() !== data.playerId) return;

				if (data.type === 'jump')
					assignedPlayer?.jump() ;
				else if (data.type === 'up')
					assignedPlayer?.stand() ;
				else if (data.type === 'down') {
					assignedPlayer?.fall() ;
					assignedPlayer?.lean() ;
				}
			}
        });


        ws.on('close', () => {
            console.log('Client disconnected');

            if (assignedPlayer && currentRoom) {
                currentRoom.removePlayer(assignedPlayer.getId());
                broadcastRoomUpdate(currentRoom);

                // Clean up empty rooms
                if (currentRoom.getPlayers().length === 0) {
                    rooms.delete(currentRoom.getId());
                }
            }
        });
	}) ;
} ;

function broadcastRoomUpdate(room: Room) {
    const roomState = {
        type: 'room_update',
        room: room.getRoomState(),
    };
    broadcastToRoom(room, roomState);
}

function broadcastToRoom(room: Room, message: object) {
    const data = JSON.stringify(message);
    room.getPlayers().forEach((player) => {
		const socket = player.getSocket() ;
        if (socket && socket.readyState === socket.OPEN) {
            socket.send(data);
        }
    });
}

function startGame(room: Room) {
    console.log(`Game started in room ${room.getId()}`);

	room.launchGame()

    const interval = 1000 / CONST.FPS;
    setInterval(() => {
        const state = !room.getGame()!.isFinished()
		? {
            type: 'state',
            gameState: room.getGame()!.getState(),
        } : {
			type: 'game_end'
		} ;

        broadcastToRoom(room, state);
    }, interval);
}

start().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
