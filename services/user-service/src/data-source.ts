import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { UserEntity } from './entities/User';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env.dev') });

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: process.env.DB_HOST || 'localhost',
	port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_POSTGRES,
	synchronize: true,
	// dropSchema: true,
	// logging: process.env.DEBUG === 'true',
	entities: [UserEntity],
});
