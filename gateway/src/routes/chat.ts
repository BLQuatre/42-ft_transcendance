import axios, { AxiosError } from "axios";
import { FastifyPluginAsync } from "fastify";
import WebSocket from "ws";
import { isAxiosResponse } from "../utils/functions";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env.dev')});

interface messageSocket {
    type: string;
    data: {
        receiverId: string,
        content: string,
    }
}

interface SchemaId {
    user_id: string;
}

export const chatRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.get('/ws/chat-friend', { websocket: true}, async (connection, req) => {
        const { user_id } =req.query as SchemaId;

            const upstream = new WebSocket(`http://${process.env.CHAT_HOST}:${process.env.CHAT_PORT}/chat/ws?user_id=${user_id}`, {
        });

        upstream.on('open', () => {
            console.log("Connexion au microservice reussi");
        });

        upstream.on('error', (err) => {
            console.error('Error on connection at microservice');
        });

        connection.on('message', (msg: any) => {
            try {
                const parsed: messageSocket = JSON.parse(msg.toString());
                upstream.readyState === 1 && upstream.send(JSON.stringify(parsed));
            } catch (err) {
                console.error("Invalid message format", err);
                connection.send(JSON.stringify({ error: "Invalid message format" }));
            }
        });


        upstream.on('message', (msg: string) => {
            console.log(`return msg: ${msg}`);
            connection.send(msg.toString());
        });

        upstream.on('close', (code ,reason) => {
            const message = `Micro-service fermé. Code: ${code}, Raison: ${reason.toString()}`;
            connection.send(message);
            connection.close();
        })
        connection.on('close', (code , reason) => {
            upstream.close()
        });
    });
}