import { UserEntity } from "../entities/User";

export type PublicUser = Omit<UserEntity, 'password'> | null;
