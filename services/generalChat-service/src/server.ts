import { buildApp } from "./app";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env.dev')});

const start = async () => {
    const app = await buildApp();

    try {
        await app.listen({
            host: process.env.CHATG_HOST,
            port: parseInt(process.env.CHATG_PORT || "0", 10)
        });
        app.log.info(`[CHAT_GENERAL] Running on http://${process.env.CHATG_HOST}:${process.env.CHATG_PORT}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    };
};

start();