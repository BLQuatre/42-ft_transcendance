import { UserEntity } from "../entities/User";
import dotenv from 'dotenv';
import path from "path";
import { PublicUser } from "./types";

export enum UserStatus {
	ONLINE = "online",
	OFFLINE = "offline"
}

dotenv.config({ path: path.resolve(__dirname, '../../../.env.dev') });

function isOnline(lastSeenAt: Date | null): boolean {
	if (!lastSeenAt) return false;

	const now = new Date();
	const diff = now.getTime() - lastSeenAt.getTime();

	return diff < 180 * 1000;
}

export function removePassword(user: UserEntity): PublicUser{
	if (!user)
		return user;
	return {
		id: user.id,
		name: user.name,
		avatar: user.avatar,
		status: isOnline(user.lastSeenAt) ? UserStatus.ONLINE : UserStatus.OFFLINE,
		tfaEnable: user.tfaEnable,
		isGoogleSignIn: user.isGoogleSignIn
	}
}

export function getEnv(key: string): string {
	const value = process.env[key];
	if (!value)
		throw new Error(`Missing environment variable: ${key}`);
	return value;
}
