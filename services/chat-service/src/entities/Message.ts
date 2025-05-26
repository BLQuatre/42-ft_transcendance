import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
} from "typeorm";

@Entity("message")
export class Message {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column()
	senderId!: string;

	@(Column!())
	receiverId!: string;

	@Column()
	content!: string;

	@CreateDateColumn()
	created_at!: Date;

	@Column({ default: false })
	isRead!: boolean;
}
