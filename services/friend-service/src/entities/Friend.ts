import { Entity, PrimaryColumn, CreateDateColumn, Column } from "typeorm";
import { FriendRequestStatus } from "../utils/interface";

@Entity("friend")
export class FriendEntity {
	@PrimaryColumn({ nullable: false })
	sender_id!: string;

	@PrimaryColumn({ nullable: false })
	receiver_id!: string;

	@Column({
		type: "enum",
		enum: FriendRequestStatus,
		default: FriendRequestStatus.PENDING,
	})
	status!: FriendRequestStatus;

	@CreateDateColumn()
	created_at!: Date;

	@CreateDateColumn()
	updated_at!: Date;
}
