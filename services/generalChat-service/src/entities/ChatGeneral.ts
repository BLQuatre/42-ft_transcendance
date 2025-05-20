import {PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Entity} from 'typeorm';

@Entity('chat_general')
export class ChatGeneral {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    content!: string;

    @Column()
    userId!: string;

    @Column()
    username!: string;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}