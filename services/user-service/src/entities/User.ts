import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn} from "typeorm"
import { IsEmail } from 'class-validator'

@Entity()
export class User {
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
        default: false
    })
    is_email_verified!: boolean

    @CreateDateColumn()
    created_at!: Date
}