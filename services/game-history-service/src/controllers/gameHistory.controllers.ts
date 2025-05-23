import { FastifyReply, FastifyRequest } from "fastify";
import { GameSession ,GameType } from "../entities/GameSession";
import { Player } from "../entities/Player";
import { GameResult } from "../entities/GameResult";
import { AppDataSource } from "../data-source";

const Session = AppDataSource.getRepository(GameSession);
const Players = AppDataSource.getRepository(Player);
const ResultGame = AppDataSource.getRepository(GameResult);

export const createGameSession = async (req: FastifyRequest, reply: FastifyReply) => {
    const body = req.body as {
        game_type: GameType;
        players: {
            user_id?: string;
            username: string;
            is_bot: boolean;
            score: number;
            is_winner: boolean;
        }[];
    };

    const session = Session.create({ game_type: body.game_type });
    await Session.save(session);

    for (const p of body.players) {
        const player = Players.create({
            user_id: p.user_id || null,
            username: p.username,
            is_bot: p.is_bot,
        });
        await Players.save(player);

        const result = ResultGame.create({
            gameSession: session,
            player,
            score: p.score,
            is_winner: p.is_winner,
        });
        await ResultGame.save(result);
    }

    return reply.code(201).send({ message: "Game session created", statusCode: 201});
};

export const getAllMyGamehistory = async (req: FastifyRequest, reply: FastifyReply) => {
    const { user_id } = req.params as { user_id: string };

    const history = await ResultGame
        .createQueryBuilder("result")
        .leftJoinAndSelect("result.player", "player")
        .leftJoinAndSelect("result.gameSession", "session")
        .leftJoinAndSelect("session.results", "allResults")
        .leftJoinAndSelect("allResults.player", "allPlayers")
        .where("player.user_id = :user_id", { user_id})
        .getMany();
    return reply.code(200).send({ message: "All our match histroy", statuCode: 200, history});
}

export const getStats = async (req: FastifyRequest, reply: FastifyReply) => {
    const { user_id } = req.params as { user_id: string };

    // 1. Nombre total de parties toutes catégories confondues
    const totalGames = await ResultGame
      .createQueryBuilder("result")
      .leftJoin("result.player", "player")
      .where("player.user_id = :user_id", { user_id })
      .getCount();

    // 2. Taux de victoire sur PONG
    const pongVictories = await ResultGame
      .createQueryBuilder("result")
      .leftJoin("result.player", "player")
      .leftJoin("result.gameSession", "session")
      .where("player.user_id = :user_id", { user_id })
      .andWhere("session.game_type = :type", { type: "PONG" })
      .andWhere("result.is_winner = true")
      .getCount();

    const pongTotal = await ResultGame
      .createQueryBuilder("result")
      .leftJoin("result.player", "player")
      .leftJoin("result.gameSession", "session")
      .where("player.user_id = :user_id", { user_id })
      .andWhere("session.game_type = :type", { type: "PONG" })
      .getCount();

    const pongWinRate = pongTotal > 0 ? (pongVictories / pongTotal) * 100 : 0;

    // 3. Meilleur score sur DINO
    const bestDinoScoreRow = await ResultGame
      .createQueryBuilder("result")
      .leftJoin("result.player", "player")
      .leftJoin("result.gameSession", "session")
      .where("player.user_id = :user_id", { user_id })
      .andWhere("session.game_type = :type", { type: "DINO" })
      .orderBy("result.score", "DESC")
      .limit(1)
      .getOne();

    const bestDinoScore = bestDinoScoreRow?.score || 0;

    return reply.code(200).send({
      user_id,
      message: "stats",
      statusCode: 200,
      total_games_played: totalGames,
      pong_win_rate: Math.round(pongWinRate * 100) / 100, // % avec 2 décimales
      best_dino_score: bestDinoScore
    });
}