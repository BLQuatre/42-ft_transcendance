import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
} from "typeorm";
import { GameResult } from "./GameResult";

export enum GameType {
	DINO = "DINO",
	PONG = "PONG",
}

@Entity("game-session")
export class GameSession {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column({
		type: "enum",
		enum: GameType,
	})
	game_type!: GameType;

	@CreateDateColumn()
	created_at!: Date;

	@OneToMany(() => GameResult, (result) => result.gameSession)
	results!: GameResult[];
}
