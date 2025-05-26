import Fastify from "fastify";
import { WebSocketServer } from "ws";

const fastify = Fastify();

interface Player {
	game: "pong" | "dino";
}

const rooms: Map<string, Player> = new Map();

const start = async () => {
	await fastify.listen({ port: 3020 });
	console.log("Server running on http://localhost:3020");

	const wss = new WebSocketServer({ server: fastify.server });

	wss.on("connection", (ws) => {
		console.log("Client connected");

		let assignedPlayer: Player | null = null;

		ws.on("message", (message) => {
			const data = JSON.parse(message.toString());

			if (data.type === "join_room") {
				const roomId = data.roomId;
				if (!rooms.has(roomId)) {
					rooms.set(roomId, new Room(roomId));
				}
				currentRoom = rooms.get(roomId)!;

				if (
					currentRoom.getPlayers().length < CONST.MAX_PLAYERS &&
					!currentRoom.getGame()
				) {
					assignedPlayer = new Player(++id, ws);
					currentRoom.addPlayer(assignedPlayer);

					// Notify the player of their ID
					ws.send(
						JSON.stringify({ type: "assign", playerId: assignedPlayer.getId() })
					);

					// Broadcast room update
					broadcastRoomUpdate(currentRoom);
				} else {
					ws.close(); // Room is full
				}
			}

			if (data.type === "toggle_ready" && assignedPlayer && currentRoom) {
				assignedPlayer.toggleReadyState(); // Use the Player class method

				// Check if all players are ready to start the game
				if (
					currentRoom.getPlayers().length >= 2 &&
					currentRoom.getPlayers().every((p) => p.isReady())
				) {
					broadcastToRoom(currentRoom, { type: "game_start" });
					startGame(currentRoom);
				} else {
					broadcastRoomUpdate(currentRoom);
				}
			}

			if (data.type === "move" && data.playerId && data.direction) {
				if (assignedPlayer?.getId() !== data.playerId) return;

				if (data.direction === "up") assignedPlayer?.setMoveUp(true);
				else if (data.direction === "notup") assignedPlayer?.setMoveUp(false);
				else if (data.direction === "down") assignedPlayer?.setMoveDown(true);
				else if (data.direction === "notdown")
					assignedPlayer?.setMoveDown(false);
			}
		});

		ws.on("close", () => {
			console.log("Client disconnected");

			if (assignedPlayer && currentRoom) {
				currentRoom.removePlayer(assignedPlayer.getId());
				broadcastRoomUpdate(currentRoom);

				// Clean up empty rooms
				if (currentRoom.getPlayers().length === 0) {
					rooms.delete(currentRoom.getId());
				}
			}
		});
	});
};
