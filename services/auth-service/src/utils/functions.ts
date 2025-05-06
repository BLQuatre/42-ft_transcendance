import { UserEntity } from "../entities/User";
import { loginWithNameInterface } from "./interface";
export type PublicUser = Omit<UserEntity, 'password_hash'> | null;

export function removePassword(user: UserEntity | null): PublicUser | null {
	if (!user)
		return user;
	const { password_hash, ...rest} = user;
	return rest;
}

export function isLoginWithName(body: any): body is loginWithNameInterface {
    return 'name' in body && 'password' in body;
}

export function getenvVar(key: string): string {
	const value = process.env[key];
	if (!value) {
		throw new Error(`Missing environment variable: ${key}`);
	}
	return value;
}