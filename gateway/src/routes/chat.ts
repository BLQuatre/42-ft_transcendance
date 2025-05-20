import axios, { AxiosError } from "axios";
import { FastifyPluginAsync } from "fastify";
import WebSocket from "ws";
import { isAxiosResponse } from "../utils/functions";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env')});

interface messageSocket {
    type: string;
    data: {
        receiverId: string,
        content: string,
    }
}

export const chatRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.get('/ws/chat-friend', { websocket: true}, async (connection, req) => {
        const token = req.headers['authorization']?.split(' ')[1];
        
        if (!token) {
            connection.close(4001, "Token not found");
            return;
        }

        try {
            const authResponse = await axios.get(`http://${process.env.AUTH_HOST}:${process.env.AUTH_PORT}/auth/access`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (authResponse.data.statusCode !== 200) {
                connection.close(4002, "invalid Token");
                return ;
            }

            // const authData = await authResponse.data;
            const userId = authResponse.data.id;
        
            const upstream = new WebSocket(`http://${process.env.CHAT_HOST}:${process.env.CHAT_PORT}/chat/ws`, {
            headers: {
                'x-user-id': userId
            }
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
    } catch (err) {
        const error = err as AxiosError;
    
        if (error.response) {
            const statusCode = error.response.status;
            const responseData = error.response.data;
    
            // Envoie l'erreur détaillée au client WebSocket (en JSON)
            connection.send(JSON.stringify({
                error: true,
                status: statusCode,
                message: responseData || "Erreur d'authentification"
            }));
    
            // Et ferme ensuite
            connection.close(4001, "Erreur d'authentification");
        } else {
            console.error('Communication error with microservice:', err);
    
            connection.send(JSON.stringify({
                error: true,
                message: "Erreur interne lors de la communication avec le microservice"
            }));
    
            connection.close(5000, "Erreur interne");
        }
    }
    });
}