import { UserEntity } from "../entities/User";

import dotenv from 'dotenv';
import path from "path";
import { PublicUser } from "./types";

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export function removePassword(user: UserEntity | null): PublicUser {
	if (!user)
		return user;
	const { password, ...rest } = user;
	return rest;
}

export function getEnv(key: string): string {
	const value = process.env[key];
	if (!value)
		throw new Error(`Missing environment variable: ${key}`);
	return value;
}
