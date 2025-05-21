import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn} from "typeorm"
import { SimpleTfaSecret } from "../utils/interface";

@Entity("user")
export class UserEntity {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column({ unique: true, nullable: false })
	name!: string;

	@Column({ nullable: false })
	password!: string

	// @Column({
	// 	unique: true,
	// 	nullable: false
	// })
	// email!: string

	@Column({
		default: false
	})
	tfaEnable!: Boolean

	@Column({
		type: 'jsonb',
		nullable: true
	})
	tfaSecret!: SimpleTfaSecret

	@Column({ nullable: true })
	avatar!: string

	@CreateDateColumn()
	created_at!: Date

	@CreateDateColumn()
	updated_at!: Date

	@Column({ type: 'timestamp', nullable: true })
	lastSeenAt!: Date
}
