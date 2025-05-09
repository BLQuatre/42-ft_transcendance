import { Entity, PrimaryColumn, CreateDateColumn, Column } from "typeorm";
import { friendRequestEnum } from "../utils/interface";

@Entity("friend")
export class FriendEntity {
	@PrimaryColumn({
		nullable: false
	})
	sender_id!: string;

	@PrimaryColumn({
		nullable: false
	})
	receiver_id!: string;

	@Column({
		type: "enum",
		enum: friendRequestEnum,
		default: friendRequestEnum.PENDING
	})
	status!: friendRequestEnum

	@CreateDateColumn()
	created_at!: Date

	@CreateDateColumn()
	updated_at!: Date
}