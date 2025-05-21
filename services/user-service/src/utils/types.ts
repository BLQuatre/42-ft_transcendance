import { UserEntity } from "../entities/User";


export enum UserStatus {
	ONLINE = "online",
	OFFLINE = "offline"
}

export interface PublicUser {
    id: string;
    name: string;
    avatar: string | null;
    status: UserStatus;
};
