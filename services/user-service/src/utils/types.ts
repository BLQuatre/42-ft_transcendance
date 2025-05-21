import { UserEntity } from "../entities/User";

export type PublicUser = Omit<UserEntity, 'password' | 'tfaEnable' | 'tfaSecret'> | null;
