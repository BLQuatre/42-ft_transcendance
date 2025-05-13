import { JwtPayload } from "jsonwebtoken";
import { UserEntity } from "../entities/User";
import { loginWithNameInterface } from "./interface";
export type PublicUser = Omit<UserEntity, 'password'>;

export function removePassword(user: UserEntity): PublicUser{
	if (!user)
		return user;
	const { password, ...rest} = user;
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

export function isJwtPayload(payload: string | JwtPayload): payload is JwtPayload {
	return typeof payload !== 'string';
}

export function isUserEntity(user: UserEntity | null): user is UserEntity{
	return typeof user !== null;
}
