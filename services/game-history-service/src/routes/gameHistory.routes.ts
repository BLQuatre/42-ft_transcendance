import { FastifyInstance } from "fastify";
import { createGameSession, getAllMyGamehistory, getStats } from "../controllers/gameHistory.controllers";

export async function gameHistoryRoutes(app: FastifyInstance) {
    app.get('/history/:user_id', getAllMyGamehistory);
    app.post('/history', createGameSession);
    app.get('/history/stats/:user_id', getStats);
}
