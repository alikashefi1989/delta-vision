import { BaseModel } from './base.model';

export interface IReturn extends BaseModel {
    [key: string]: any;
}

export type TReturnCreate = Omit<IReturn, keyof BaseModel>;
export type TReturnUpdate = TReturnCreate;
