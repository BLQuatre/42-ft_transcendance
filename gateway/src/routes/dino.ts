import { FastifyPluginAsync } from "fastify";
import WebSocket from "ws";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, '../../../.en.dev') });

interface messageSocket {
    type: string; // join_room | toggle_ready | jump | up | down
    roomId: string; // uuid ? int
    playerId: string; // uuid
}

interface SchemaId {
    playerId: string
}

export const dinoRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.get('/ws/dino', { websocket: true}, async (connection, req) => {
        // const { playerId } = req.query as SchemaId
        // console.log(`client id : ${playerId}`);
        const upstream = new WebSocket(`http://${process.env.DINO_HOST}:${process.env.DINO_PORT}`);

        upstream.on('open', () => {
            console.log("Connexion au microservice resussi");
        });

        upstream.on('error', (err) => {
            console.error("Error on connection at microservice");
        });

        connection.on('message', (msg:any) => {
            try {
                const parsed: messageSocket = JSON.parse(msg.toString());
                upstream.readyState === 1 && upstream.send(JSON.stringify(parsed));
            } catch (err) {
                console.error("Invalid message format", err);
                connection.send(JSON.stringify({ error: "Invalid message formet"} ));
            }
        })

        upstream.on('message', (msg:string) => {
            console.log(`return msg: ${msg}`);
            connection.send(msg.toString());
        });

        upstream.on('close', (code, reason) => {
            const message = `Dino closed. Code : ${code}, Reason : ${reason}`;
            connection.send(message);
            connection.close();
        });
        connection.on('close', (code, reason) => {
            upstream.close()
        });
    });
}