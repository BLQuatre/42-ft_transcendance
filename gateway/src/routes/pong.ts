import { FastifyPluginAsync } from 'fastify';
import WebSocket from 'ws';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env.dev') });

interface messageSocket {
    type: string;  // join_room | toggle_ready | move
    roomId: string;
    direction: string; // up | notup | down | notdown
    uuid: string;
}

export const pongRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.get('/ws/pong', { websocket: true }, async (connection, req) => {
        const upstream = new WebSocket(`http://${process.env.PONG_HOST}:${process.env.PONG_PORT}`);

        upstream.on('open', () => {
            console.log("Connected to pong!")
        });

        upstream.on('error', (err) => {
            console.error("Error on connection at pong!");
        });

        connection.on('message', (msg:any) => {
            try {
                const parsed: messageSocket = JSON.parse(msg.toString());
                upstream.readyState === 1 && upstream.send(JSON.stringify(parsed));
            } catch (err) {
                console.error("Invalid message format", err);
                connection.send(JSON.stringify({ error: "Invalid message format"}));
            }
        })

        upstream.on('message', (msg:string) => {
            connection.send(msg.toString());
        })

        upstream.on('close', (code, reason) => {
            const message = `Pong closed. Code : ${code}, Reason : ${reason}`;
            connection.send(message);
            connection.close();
        })
        connection.on('close', (code, reason) => {
            upstream.close()
        })
    })
}