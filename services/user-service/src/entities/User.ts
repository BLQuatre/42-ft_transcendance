import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn} from "typeorm"
import { GeneratedSecret, SimpleTfaSecret } from "../utils/interface";

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

	@CreateDateColumn()
	created_at!: Date

	@CreateDateColumn()
	updated_at!: Date

}
