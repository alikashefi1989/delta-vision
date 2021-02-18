import { BaseModel } from './base.model';

export interface ITag extends BaseModel {
    title: { [key: string]: string };
}

export type TTagCreate = Omit<ITag, keyof BaseModel>;
export type TTagUpdate = TTagCreate;
