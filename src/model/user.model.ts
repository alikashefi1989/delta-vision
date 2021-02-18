import { GENDER } from '../enum/gender.enum';
import { BaseModel } from './base.model';

export interface IUser extends BaseModel {
    name: string;
    email: string;
    gender?: GENDER;
    isActive?: boolean;
    birthDate?: number;
    lastInteract?: number;
    lastLogin?: number;
    lastIp?: string;
    // first_name: string;
    // last_name: string;
    // username: string;
    // country?: string;
    country?: {
        id: string;
        name: { [key: string]: string };
    };
    phone?: string;
    permissions?: Array<string>;
    image?: { url: string };
}

export type TUserCreate = Omit<IUser, keyof BaseModel | 'permissions'> & {
    password: string;
};
export type TUserUpdate = Omit<TUserCreate, 'email' | 'password'>;
