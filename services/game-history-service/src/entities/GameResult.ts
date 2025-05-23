import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { GameSession } from "./GameSession";
import { Player } from "./Player";

@Entity()
export class GameResult {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => GameSession, session => session.results, { onDelete: "CASCADE" })
  @JoinColumn({ name: "game_session_id" })
  gameSession!: GameSession;

  @ManyToOne(() => Player, player => player.results, { onDelete: "CASCADE" })
  @JoinColumn({ name: "player_id" })
  player!: Player;

  @Column()
  score!: number;

  @Column()
  is_winner!: boolean;
}
