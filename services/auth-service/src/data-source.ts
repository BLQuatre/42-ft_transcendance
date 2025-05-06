import 'reflect-metadata'; // Assure-toi que c’est au tout début du point d'entrée, si ce fichier est exécuté directement

import { DataSource } from 'typeorm';
import { UserEntity } from './entities/User';
import dotenv from 'dotenv';
import path from 'path';

// Charge le .env à la racine du projet
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_POSTGRES,
  synchronize: true,
  // dropSchema: true,
  logging: false,
  entities: [UserEntity],
});
