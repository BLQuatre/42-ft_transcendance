import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn} from "typeorm"

@Entity("user")
export class UserEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({
        unique: true,
        nullable: false
    })
    name!: string;

    @Column({
        unique: true,
        nullable: false
    })
    email!: string;

    @Column({
        nullable: false
    })
    password!: string

    @Column({
        default: false
    })
    is_email_verified!: boolean

    @CreateDateColumn()
    created_at!: Date

    @CreateDateColumn()
    updated_at!: Date
}