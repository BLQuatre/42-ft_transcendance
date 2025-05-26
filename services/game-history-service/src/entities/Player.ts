import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { GameResult } from "./GameResult";

@Entity()
export class Player {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column({ type: "uuid", nullable: true })
	user_id!: string | null; // ID venant du micro-service user

	@Column()
	username!: string;

	@Column({ default: false })
	is_bot!: boolean;

	@OneToMany(() => GameResult, (result) => result.player)
	results!: GameResult[];
}
