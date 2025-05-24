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
    tfaEnable: Boolean,
    isGoogleSignIn: Boolean
	created_at: Date;  // Add creation timestamp
	updated_at: Date;  // Add update timestamp
};
