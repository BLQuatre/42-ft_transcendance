import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
} from "typeorm";

@Entity("user")
export class UserEntity {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column({ unique: true, nullable: false })
	name!: string;

	@Column({ nullable: false })
	password!: string;

	@CreateDateColumn()
	created_at!: Date;

	@CreateDateColumn()
	updated_at!: Date;
}
